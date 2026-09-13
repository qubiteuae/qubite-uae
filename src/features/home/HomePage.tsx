import { useTranslation } from 'react-i18next'
import { AsicComparison } from '@/features/home/components/AsicComparison'
import { CtaBanner } from '@/features/home/components/CtaBanner'
import { EcosystemCategories } from '@/features/home/components/EcosystemCategories'
import { FacilitiesGallery } from '@/features/home/components/FacilitiesGallery'
import { GlobalInfrastructure } from '@/features/home/components/GlobalInfrastructure'
import { Hero } from '@/features/home/components/Hero'
import { MiningProcess } from '@/features/home/components/MiningProcess'
import { StabilityGrid } from '@/features/home/components/StabilityGrid'
import { WhyChooseUs } from '@/features/home/components/WhyChooseUs'
import { usePageSeo } from '@/hooks/usePageSeo'

export function HomePage() {
  const { t } = useTranslation()
  usePageSeo({ title: t('seo.home.title'), description: t('seo.home.description'), path: '/' })

  return (
    <>
      <Hero />
      <AsicComparison />
      <MiningProcess />
      <WhyChooseUs />
      <EcosystemCategories />
      <StabilityGrid />
      <GlobalInfrastructure />
      <FacilitiesGallery />
      <CtaBanner />
    </>
  )
}
