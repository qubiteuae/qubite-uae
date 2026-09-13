import { useTranslation } from 'react-i18next'
import { LegalPage } from '@/features/legal/LegalPage'
import { usePageSeo } from '@/hooks/usePageSeo'

export function TermsPage() {
  const { t } = useTranslation()
  usePageSeo({ title: t('seo.terms.title'), description: t('seo.terms.description'), path: '/terms' })

  return <LegalPage contentKey="terms" />
}
