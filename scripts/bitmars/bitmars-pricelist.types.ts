// Types for bitmars-pricelist.json. Authored directly from the JSON shape —
// no separate source for these existed alongside the price list.

export interface BitmarsContact {
  name: string
  whatsapp: string
  email: string
}

export interface BitmarsMeta {
  company: string
  tagline: string
  documentTitle: string
  services: string[]
  priceDate: string
  currency: 'USD'
  incoterm: string
  sourceFile: string
  headquarters: string
  branches: string[]
  warehouses: string[]
  contact: BitmarsContact
}

export type HashrateUnit = 'T' | 'G' | 'M' | 'K' | 'kW'

export interface BitmarsHashrate {
  /** Verbatim as it appeared in the source spreadsheet, e.g. "94 - 104" or "865". */
  raw: string
  min: number
  max: number
  unit: HashrateUnit
}

export type ProductStatus = 'New' | 'Used' | 'Preorder'

export interface BitmarsProduct {
  id: string
  brand: string
  category: string
  section: string
  status: ProductStatus
  model: string
  mixedHashrate: boolean
  warrantyNote: string | null
  hashrate: BitmarsHashrate
  /** Null for kW container listings, which have no per-unit efficiency figure. */
  efficiency: number | null
  efficiencyUnit: 'J/T' | 'W'
  pricePerTerahashUsd: number | null
  unitPriceUsd: number | null
  moq: number
  leadtime: string
}

export interface BitmarsPricelist {
  meta: BitmarsMeta
  notes: string[]
  products: BitmarsProduct[]
}

export type PriceSource = 'listed' | 'derived' | 'unavailable'

export interface ResolvedPrice {
  id: string
  brand: string
  model: string
  /** hashrate.raw verbatim — never collapsed to a single number. */
  hashrateDisplay: string
  unit: HashrateUnit
  status: ProductStatus
  moq: number
  leadtime: string
  unitPriceUsd: number | null
  pricePerTerahashUsd: number | null
  priceSource: PriceSource
  priceIsEstimate: boolean
}
