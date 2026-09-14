import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadPricelist, resolveAll } from './process-prices.mjs'

const pricelist = loadPricelist()
const productsById = new Map(pricelist.products.map((p) => [p.id, p]))
const resolved = resolveAll(pricelist.products)

test('resolves exactly 100 entries', () => {
  assert.equal(resolved.length, 100)
})

test('"unavailable" only occurs where the source genuinely has both fields null', () => {
  for (const r of resolved) {
    const source = productsById.get(r.id)
    if (r.priceSource === 'unavailable') {
      assert.equal(source.unitPriceUsd, null, `${r.id} marked unavailable but had a listed unitPriceUsd`)
      assert.equal(source.pricePerTerahashUsd, null, `${r.id} marked unavailable but had a pricePerTerahashUsd`)
    } else {
      assert.ok(
        source.unitPriceUsd != null || source.pricePerTerahashUsd != null,
        `${r.id} not marked unavailable but source has no price data`,
      )
    }
  }
})

test('every derived price is within $1 of hashrate.max * pricePerTerahashUsd', () => {
  const derived = resolved.filter((r) => r.priceSource === 'derived')
  assert.ok(derived.length > 0, 'expected at least one derived row')
  for (const r of derived) {
    const source = productsById.get(r.id)
    const expected = source.pricePerTerahashUsd * source.hashrate.max
    assert.ok(
      Math.abs(r.unitPriceUsd - expected) <= 1,
      `${r.id}: derived ${r.unitPriceUsd} not within $1 of ${expected}`,
    )
    assert.equal(r.priceIsEstimate, true)
  }
})

test('listed prices are used as-is and never flagged as estimates', () => {
  const listed = resolved.filter((r) => r.priceSource === 'listed')
  for (const r of listed) {
    const source = productsById.get(r.id)
    assert.equal(r.unitPriceUsd, source.unitPriceUsd)
    assert.equal(r.priceIsEstimate, false)
  }
})

test('hashrateDisplay is always the verbatim raw string, ranges never collapsed', () => {
  for (const r of resolved) {
    const source = productsById.get(r.id)
    assert.equal(r.hashrateDisplay, source.hashrate.raw)
  }
})

test('$/TH is only backfilled for T-unit rows, never for G/M/K/kW', () => {
  for (const r of resolved) {
    if (r.unit !== 'T') {
      const source = productsById.get(r.id)
      // Only ever carries forward a value that was already present on the source row.
      assert.equal(r.pricePerTerahashUsd, source.pricePerTerahashUsd)
    }
  }
})
