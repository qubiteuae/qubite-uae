import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'

const avatars = ['/figma/hero/avatar-1.webp', '/figma/hero/avatar-2.webp', '/figma/hero/avatar-3.webp']

const GRADIENT = 'linear-gradient(90deg, #e8a765 0%, #b8794a 100%)'

function HeadsetIcon({ className = 'size-3.5' }: { className?: string }) {
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

function HexIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M8 1.5 14 5v6l-6 3.5L2 11V5l6-3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.5 6h5M5.5 8h5M5.5 10h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function StatusDot({ className = '' }: { className?: string }) {
  return <span className={`inline-block size-1.5 rounded-full bg-accent-green ${className}`} aria-hidden="true" />
}

function PowerIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M8 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.5 4.2a5 5 0 1 0 7 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ThermometerIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M9.5 9.1V3.5a1.5 1.5 0 0 0-3 0v5.6a2.5 2.5 0 1 0 3 0Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NetworkIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <circle cx="8" cy="3" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="3.5" cy="12" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12.5" cy="12" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.6V8M8 8 4.2 10.7M8 8l3.8 2.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function Hero() {
  const { t, i18n } = useTranslation()
  const toLang = useLocalizedPath()
  const sectionRef = useRef<HTMLElement>(null)

  const scrollToNext = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[#050301]" aria-hidden="true" />
      <img
        src="/figma/hero/hero-bg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" aria-hidden="true" />

      <Container className="relative flex min-h-[560px] flex-col justify-center pt-30 pb-24 md:min-h-[820px] 2xl:max-w-[1600px]">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.5fr_1fr] 2xl:gap-20">
          <div className="flex max-w-[820px] flex-col gap-5 2xl:max-w-[900px]">
            <h1 className="animate-fade-in-up font-display text-[44px] leading-[1.05] font-black tracking-tight text-white md:text-[64px]">
              {t('home.hero.heading1')}
              <br />
              <span style={{ backgroundImage: GRADIENT }} className="bg-clip-text text-transparent">
                {t('home.hero.heading2')}
              </span>
            </h1>
            <p
              className="animate-fade-in-up max-w-[520px] text-base leading-relaxed text-white md:text-18"
              style={{ animationDelay: '120ms' }}
            >
              {t('home.hero.paragraph')}
            </p>
            <div className="animate-fade-in-up flex flex-wrap items-center gap-3.5 pt-2" style={{ animationDelay: '240ms' }}>
              <Link
                to={toLang('/asic-machines')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-white/30 hover:bg-black/60 active:scale-95"
              >
                <img src="/figma/hero/shopping-cart.svg" alt="" className="size-[14px]" />
                {t('home.hero.discoverMachines')}
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('home_hero_primary', i18n.language)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-white/30 hover:bg-black/60 active:scale-95"
              >
                <HeadsetIcon className="size-[14px]" />
                {t('home.hero.talkToHuman')}
              </a>
            </div>
          </div>

          <div
            className="relative hidden h-[440px] lg:block"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {/* back coin — offset down-left, dimmer, creates the stacked-coin edge peeking out */}
            <img
              src="/bitcoin-coin.png"
              alt=""
              className="absolute bottom-8 left-[300px] z-0 h-[180px] w-[190px] object-contain brightness-75"
              aria-hidden="true"
            />
            {/* front coin */}
            <img
              src="/bitcoin-coin.png"
              alt=""
              className="absolute bottom-12 left-[330px] z-[1] h-[190px] w-[200px] object-contain"
              style={{ filter: 'drop-shadow(0 0 40px rgba(217,154,43,0.45))' }}
              aria-hidden="true"
            />

            <div className="animate-float-tilt-back absolute top-10 right-4 z-10 flex w-[360px] flex-col gap-4 rounded-2xl border border-border bg-surface-glass p-6 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.6)] backdrop-blur-[15px] transition-shadow duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.25)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base font-semibold text-white">
                  <HexIcon className="size-5 text-accent-bronze-tint" />
                  {t('home.hero.hostingCard.title')}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-accent-green/10 px-2.5 py-1.5 text-sm font-semibold text-accent-green">
                  <StatusDot />
                  {t('home.hero.hostingCard.status')}
                </span>
              </div>
              <span className="text-sm text-text-subtle">{t('home.hero.hostingCard.subtitle')}</span>

              <div className="flex items-center gap-3">
                <svg viewBox="0 0 240 40" className="h-10 flex-1" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M0 28 Q30 10 55 22 T110 18 T170 30 T230 10"
                    fill="none"
                    stroke="var(--color-accent-green)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="230" cy="10" r="4" fill="var(--color-accent-green)" />
                </svg>
              </div>
            </div>

            <div className="animate-float-tilt-front absolute bottom-6 left-0 z-10 flex w-[380px] flex-col gap-4 rounded-2xl border border-border bg-surface-glass p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-[15px] transition-shadow duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.25)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base font-semibold text-white">
                  <HexIcon className="size-5 text-accent-bronze-tint" />
                  {t('home.hero.monitoringCard.title')}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-accent-green/10 px-2.5 py-1.5 text-sm font-semibold text-accent-green">
                  <StatusDot />
                  {t('home.hero.monitoringCard.status')}
                </span>
              </div>
              <span className="text-sm text-text-subtle">{t('home.hero.monitoringCard.subtitle')}</span>

              <div className="mt-1 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                {[
                  { Icon: PowerIcon, label: t('home.hero.monitoringCard.power') },
                  { Icon: ThermometerIcon, label: t('home.hero.monitoringCard.temperature') },
                  { Icon: NetworkIcon, label: t('home.hero.monitoringCard.network') },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <span className="relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-dim">
                      <Icon className="size-5" />
                      <StatusDot className="absolute -top-0.5 -right-0.5 border border-black" />
                    </span>
                    <span className="text-xs text-text-subtle">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-0 hidden items-center justify-between px-5 py-6 sm:px-10 lg:flex lg:px-20">
        <button
          type="button"
          onClick={scrollToNext}
          className="group flex cursor-pointer items-center gap-2 text-xs font-semibold tracking-wide text-text-dim uppercase transition-colors hover:text-white"
        >
          {t('home.hero.scroll')}
          <img src="/figma/hero/arrow-down.svg" alt="" className="size-3.5 animate-bounce" />
        </button>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('home_hero_meet_experts', i18n.language)}
          className="flex items-center gap-4 text-[13px] text-text-dim transition-colors hover:text-white"
        >
          {t('home.hero.meetExperts')}
          <span className="flex items-center">
            <span className="flex -space-x-2">
              {avatars.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="size-7 rounded-full border-[1.5px] border-border-avatar object-cover transition-transform duration-200 hover:z-10 hover:scale-110"
                  style={{ zIndex: avatars.length - i }}
                />
              ))}
            </span>
            <span className="pl-3 text-[13px] font-semibold text-white">{t('home.hero.miningExperts')}</span>
          </span>
        </a>
      </div>
    </section>
  )
}
