import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { usePageSeo } from '@/hooks/usePageSeo'
import i18next from '@/i18n'

const GRADIENT = 'linear-gradient(90deg, #e8a765 0%, #b8794a 100%)'

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
      </Container>
    </div>
  )
}
