import { useTranslation } from 'react-i18next'
import { HostingCta } from '@/features/hosting/components/HostingCta'
import { HostingFaq } from '@/features/hosting/components/HostingFaq'
import { HostingHero } from '@/features/hosting/components/HostingHero'
import { PricingPlans } from '@/features/hosting/components/PricingPlans'
import { WhatsIncluded } from '@/features/hosting/components/WhatsIncluded'
import { usePageSeo } from '@/hooks/usePageSeo'

export function HostingPage() {
  const { t } = useTranslation()
  usePageSeo({ title: t('seo.hosting.title'), description: t('seo.hosting.description'), path: '/hosting' })

  return (
    <>
      <HostingHero />
      <PricingPlans />
      <WhatsIncluded />
      <HostingFaq />
      <HostingCta />
    </>
  )
}
