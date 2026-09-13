import { useTranslation } from 'react-i18next'
import { AboutHero } from '@/features/about/components/AboutHero'
import { ContactSection } from '@/features/about/components/ContactSection'
import { LocationsSection } from '@/features/about/components/LocationsSection'
import { TeamGrid } from '@/features/about/components/TeamGrid'
import { usePageSeo } from '@/hooks/usePageSeo'

export function AboutPage() {
  const { t } = useTranslation()
  usePageSeo({ title: t('seo.about.title'), description: t('seo.about.description'), path: '/about' })

  return (
    <>
      <AboutHero />
      <TeamGrid />
      <LocationsSection />
      <ContactSection />
    </>
  )
}
