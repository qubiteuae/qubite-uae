// Resolves a single price for every BitMars price-list row and writes
// bitmars-prices.json alongside this script. Run: node process-prices.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const dir = fileURLToPath(new URL('.', import.meta.url))

export function loadPricelist(path = `${dir}/bitmars-pricelist.json`) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** @param {import('./bitmars-pricelist.types.ts').BitmarsProduct} product */
export function resolvePrice(product) {
  const { id, brand, model, status, moq, leadtime, hashrate, unitPriceUsd, pricePerTerahashUsd } = product

  let resolvedUnitPrice = unitPriceUsd
  let resolvedPerTerahash = pricePerTerahashUsd
  let priceSource
  let priceIsEstimate

  if (unitPriceUsd != null) {
    priceSource = 'listed'
    priceIsEstimate = false
  } else if (pricePerTerahashUsd != null) {
    // Same formula the source spreadsheet used: $/TH x max hashrate in the bin.
    resolvedUnitPrice = Math.round(pricePerTerahashUsd * hashrate.max)
    priceSource = 'derived'
    priceIsEstimate = true
  } else {
    resolvedUnitPrice = null
    priceSource = 'unavailable'
    priceIsEstimate = false
  }

  // Backfill $/TH only when it's missing, a resolved unit price exists, and
  // the unit is actually terahashes — meaningless for G/M/K alt-coin miners
  // and kW containers, so leave those null.
  if (resolvedPerTerahash == null && resolvedUnitPrice != null && hashrate.unit === 'T') {
    resolvedPerTerahash = Math.round((resolvedUnitPrice / hashrate.max) * 100) / 100
  }

  return {
    id,
    brand,
    model,
    hashrateDisplay: hashrate.raw,
    unit: hashrate.unit,
    status,
    moq,
    leadtime,
    unitPriceUsd: resolvedUnitPrice,
    pricePerTerahashUsd: resolvedPerTerahash,
    priceSource,
    priceIsEstimate,
  }
}

export function resolveAll(products) {
  return products.map(resolvePrice)
}

function printSummary(products, resolved) {
  const categoryById = new Map(products.map((p) => [p.id, p.category]))
  const byUnit = { T: [], container: [], altcoin: [] }
  for (const r of resolved) {
    if (r.unit === 'kW') byUnit.container.push(r)
    else if (r.unit === 'T') byUnit.T.push(r)
    else byUnit.altcoin.push(r)
  }

  const categories = [...new Set(byUnit.T.map((r) => categoryById.get(r.id)))]
  for (const category of categories) {
    const rows = byUnit.T
      .filter((r) => categoryById.get(r.id) === category)
      .sort((a, b) => {
        if (a.pricePerTerahashUsd == null) return 1
        if (b.pricePerTerahashUsd == null) return -1
        return a.pricePerTerahashUsd - b.pricePerTerahashUsd
      })
    console.log(`\n=== ${category} ===`)
    console.table(
      rows.map((r) => ({
        model: r.model,
        hashrate: r.hashrateDisplay,
        status: r.status,
        'USD/TH': r.pricePerTerahashUsd ?? '—',
        unitPriceUsd: r.unitPriceUsd ?? '—',
        priceSource: r.priceSource,
      })),
    )
  }

  console.log('\n=== Containers (kW) ===')
  console.table(
    byUnit.container
      .sort((a, b) => (a.unitPriceUsd ?? Infinity) - (b.unitPriceUsd ?? Infinity))
      .map((r) => ({
        model: r.model,
        power: `${r.hashrateDisplay} ${r.unit}`,
        status: r.status,
        unitPriceUsd: r.unitPriceUsd ?? '—',
        priceSource: r.priceSource,
      })),
  )

  console.log('\n=== Non-BTC / Alt-Coin Miners (G / M / K units) ===')
  console.table(
    byUnit.altcoin
      .sort((a, b) => (a.unitPriceUsd ?? Infinity) - (b.unitPriceUsd ?? Infinity))
      .map((r) => ({
        model: r.model,
        hashrate: `${r.hashrateDisplay} ${r.unit}`,
        status: r.status,
        unitPriceUsd: r.unitPriceUsd ?? '—',
        priceSource: r.priceSource,
      })),
  )
}

// Only run when executed directly (`node process-prices.mjs`), not on import.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pricelist = loadPricelist()
  const resolved = resolveAll(pricelist.products)
  writeFileSync(`${dir}/bitmars-prices.json`, JSON.stringify(resolved, null, 2) + '\n')
  console.log(`Wrote ${resolved.length} resolved prices to bitmars-prices.json`)
  printSummary(pricelist.products, resolved)
}
