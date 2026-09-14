import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5V7a5 5 0 0 1 10 0v1.5M3 8.5v3a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3Zm10 0v3a1 1 0 0 1-1 1h-.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1H13Zm-1 4.5v.5a1.5 1.5 0 0 1-1.5 1.5H8.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CtaBanner() {
  const { t, i18n } = useTranslation()
  const toLang = useLocalizedPath()

  return (
    <section className="deployment-cta-section">
      <Reveal className="deployment-cta-reveal">
        <div className="deployment-cta-banner">
          <div className="deployment-cta-copy">
            <h2>{t('home.ctaBanner.heading')}</h2>
            <p>{t('home.ctaBanner.paragraph')}</p>
          </div>

          <div className="deployment-cta-actions">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('home_cta_banner', i18n.language)}
              className="deployment-cta-button deployment-cta-human"
            >
              <HeadsetIcon />
              {t('home.ctaBanner.talkToHuman')}
            </a>
            <Link to={toLang('/asic-machines')} className="deployment-cta-button deployment-cta-products">
              <ArrowIcon />
              {t('home.ctaBanner.exploreProducts')}
            </Link>
          </div>
        </div>
      </Reveal>
      <span className="deployment-cta-orb" aria-hidden="true" />
    </section>
  )
}
