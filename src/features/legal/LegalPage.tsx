import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'

interface LegalSection {
  heading: string
  body: string
}

export function LegalPage({ contentKey }: { contentKey: 'privacyPolicy' | 'terms' }) {
  const { t } = useTranslation()
  const sections = t(`legal.${contentKey}.sections`, { returnObjects: true }) as LegalSection[]

  return (
    <div className="bg-bg pt-24 pb-24">
      <Container className="max-w-[760px]">
        <Link to="/" className="text-xs font-semibold text-accent-bronze-tint transition-colors hover:text-white">
          &larr; {t('legal.backHome')}
        </Link>

        <h1 className="mt-4 text-[32px] font-black text-white sm:text-[40px]">{t(`legal.${contentKey}.title`)}</h1>
        <p className="mt-2 text-xs text-text-faint">{t('legal.lastUpdated')}</p>

        <p className="mt-6 text-sm leading-relaxed text-text-dim">{t(`legal.${contentKey}.intro`)}</p>

        <div className="mt-8 flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-white">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-text-dim">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
