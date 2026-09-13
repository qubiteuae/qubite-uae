import { useTranslation } from 'react-i18next'
import { AsicHero } from '@/features/asic-machines/components/AsicHero'
import { ProductsSection } from '@/features/asic-machines/components/ProductsSection'
import { usePageSeo } from '@/hooks/usePageSeo'

export function AsicMachinesPage() {
  const { t } = useTranslation()
  usePageSeo({ title: t('seo.machines.title'), description: t('seo.machines.description'), path: '/asic-machines' })

  return (
    <>
      <AsicHero />
      <ProductsSection />
    </>
  )
}
