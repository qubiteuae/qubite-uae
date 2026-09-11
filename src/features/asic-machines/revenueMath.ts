import type { Product } from './products'

export const BASE_BTC_PRICE = 80_000

export interface HostingTier {
  name: string
  tagline: string
  rate: number
  recommended?: boolean
}

/**
 * `dailyProfitUsd` (shown site-wide as "Est. Daily Profit") is already NET of
 * hosting costs, assumed at the recommended tier's rate. To use it as a basis
 * for a BTC-price-scalable revenue figure without double-subtracting hosting
 * cost later, we gross it back up to a baseline monthly revenue first.
 */
export function calcBtcMinedPerMonth(product: Product, hostingTiers: HostingTier[]): number {
  const baselineIndex = hostingTiers.findIndex((tier) => tier.recommended)
  const baselineRate = hostingTiers[baselineIndex === -1 ? 0 : baselineIndex].rate
  const baselineHostingCost = (product.powerValue * 24 * 30 * baselineRate) / 1000
  const baselineNetMonthly = (product.dailyProfitUsd ?? 0) * 30
  const baselineGrossMonthly = baselineNetMonthly + baselineHostingCost
  return baselineGrossMonthly / BASE_BTC_PRICE
}

export function calcMonthlyHostingCost(product: Product, rate: number): number {
  return (product.powerValue * 24 * 30 * rate) / 1000
}

/** The BTC price below which this product+tier combination stops being profitable. */
export function calcBreakevenPrice(product: Product, hostingTiers: HostingTier[], rate: number): number {
  const btcMinedPerMonth = calcBtcMinedPerMonth(product, hostingTiers)
  const hostingCost = calcMonthlyHostingCost(product, rate)
  return hostingCost / btcMinedPerMonth
}
