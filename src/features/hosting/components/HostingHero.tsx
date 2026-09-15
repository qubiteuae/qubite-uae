import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'

const GRADIENT = 'linear-gradient(90deg, #e8a765 0%, #b8794a 100%)'

function GaugeIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 18 15.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1.3" fill="currentColor" />
    </svg>
  )
}

function ReceiptIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ShieldCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 2 20 5v6.5C20 17 16.5 20.5 12 22 7.5 20.5 4 17 4 11.5V5l8-3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.5 12 11 14.5 15.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

const valuePropIcons = [GaugeIcon, ReceiptIcon, ShieldCheckIcon]

export function HostingHero() {
  const { t, i18n } = useTranslation()
  const valueProps = t('hosting.hero.valueProps', { returnObjects: true }) as { title: string; description: string }[]

  return (
    <section className="relative overflow-hidden bg-black">
      <img
        src="/facilities/facility-6.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" aria-hidden="true" />

      <Container className="relative flex flex-col items-center gap-5 pt-30 pb-16 text-center md:pt-36">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(45,212,191,0.3)] bg-[rgba(20,60,55,0.4)] px-4 py-1.5 text-[10px] font-bold tracking-[0.08em] text-[#2dd4bf] uppercase">
            <span className="size-1.5 rounded-full bg-[#2dd4bf]" />
            {t('hosting.hero.badge')}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="max-w-[760px] text-[36px] leading-tight font-black text-white sm:text-[48px]">
            {t('hosting.hero.heading1')}{' '}
            <span style={{ backgroundImage: GRADIENT }} className="bg-clip-text text-transparent">
              {t('hosting.hero.heading2')}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[620px] text-base text-text-dim md:text-lg">
            {t('hosting.hero.paragraphPrefix')} <span className="font-semibold text-white">4.0¢ to 6.8¢</span>{' '}
            {t('hosting.hero.paragraphSuffix')}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 rounded-full bg-accent-bronze px-6 py-3 text-sm font-bold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] transition-all duration-200 hover:brightness-110 active:scale-95"
            >
              {t('hosting.hero.comparePlans')}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('hosting_hero', i18n.language)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-white/30 hover:bg-black/60 active:scale-95"
            >
              <HeadsetIcon />
              {t('hosting.hero.talkToHuman')}
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {valueProps.map((item, i) => {
            const Icon = valuePropIcons[i]
            return (
              <Reveal key={item.title} delay={260 + i * 90}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-6 text-center backdrop-blur-sm">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-[rgba(232,167,101,0.35)] bg-[rgba(232,167,101,0.1)] text-[#e8a765]">
                    <Icon />
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-text-dim">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
