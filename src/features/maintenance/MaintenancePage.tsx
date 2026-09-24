import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { usePageSeo } from '@/hooks/usePageSeo'
import i18next from '@/i18n'
import { WHATSAPP_LINK } from '@/lib/links'

const GRADIENT = 'linear-gradient(90deg, #e8a765 0%, #b8794a 100%)'

function HeadsetIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
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

export function MaintenancePage() {
  const { t } = useTranslation()
  const location = useLocation()

  // No <LanguageRoute> wrapper here (maintenance mode replaces the entire
  // route tree with a single catch-all), so language is derived directly
  // from the URL prefix, mirroring LanguageRoute's own logic.
  useEffect(() => {
    const lang = location.pathname.startsWith('/ar') ? 'ar' : 'en'
    if (i18next.language !== lang) void i18next.changeLanguage(lang)
  }, [location.pathname])

  usePageSeo({
    title: t('seo.maintenance.title'),
    description: t('seo.maintenance.description'),
    path: '/',
    noindex: true,
  })

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-5 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(232,167,101,0.12), transparent 70%)' }}
        aria-hidden="true"
      />

      <Container className="relative flex max-w-[640px] flex-col items-center gap-6 text-center">
        <img src="/figma/hero/logo.webp" alt="Qubite International" className="h-11 w-auto object-contain" />

        <Badge>{t('maintenance.badge')}</Badge>

        <h1 className="font-display text-[32px] leading-tight font-black tracking-tight text-white sm:text-[44px]">
          {t('maintenance.heading1')}{' '}
          <span style={{ backgroundImage: GRADIENT }} className="bg-clip-text text-transparent">
            {t('maintenance.heading2')}
          </span>
        </h1>

        <p className="max-w-[520px] text-base leading-relaxed text-text-dim">{t('maintenance.body')}</p>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-white/30 hover:bg-black/60 active:scale-95"
        >
          <HeadsetIcon />
          {t('maintenance.talkToHuman')}
        </a>
      </Container>
    </div>
  )
}
