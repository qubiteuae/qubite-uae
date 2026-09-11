import { AsicHero } from '@/features/asic-machines/components/AsicHero'
// AsicRevenueCalculator temporarily removed for Google Ads Financial Products
// policy compliance — its BTC-price slider floor is clamped above breakeven so
// it can never show a loss, which conflicts with the "results vary" requirement.
// import { AsicRevenueCalculator } from '@/features/asic-machines/components/AsicRevenueCalculator'
import { ProductsSection } from '@/features/asic-machines/components/ProductsSection'

export function AsicMachinesPage() {
  return (
    <>
      <AsicHero />
      <ProductsSection />
      {/* <AsicRevenueCalculator /> */}
    </>
  )
}
