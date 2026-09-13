import { useTranslation } from 'react-i18next'
import { LegalPage } from '@/features/legal/LegalPage'
import { usePageSeo } from '@/hooks/usePageSeo'

export function PrivacyPolicyPage() {
  const { t } = useTranslation()
  usePageSeo({
    title: t('seo.privacyPolicy.title'),
    description: t('seo.privacyPolicy.description'),
    path: '/privacy-policy',
  })

  return <LegalPage contentKey="privacyPolicy" />
}
