import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'

const GRADIENT = 'linear-gradient(90deg, #e8a765 0%, #b8794a 100%)'

const stars = Array.from({ length: 70 }, (_, i) => {
  // deterministic pseudo-random spread, computed once at module load
  const seed = i * 137.5
  const x = (seed * 3.7) % 100
  const y = (seed * 1.3 + i * 11) % 100
  const size = 1 + ((i * 7) % 3 === 0 ? 1 : 0)
  const opacity = 0.15 + ((i * 13) % 40) / 100
  return { x, y, size, opacity }
})

function HexagonIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M12 2v10M12 12 21 7M12 12 3 7M12 12v10" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
    </svg>
  )
}

function HardwareIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function BoltIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M9 1.5 3 9h4l-1 5.5 6-7.5H8l1-5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function HostingIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <ellipse cx="8" cy="3.2" rx="5.5" ry="1.8" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.5 3.2V8c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8V3.2M2.5 8v4.8c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RewardsIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M2 12 6 7l3 2.5L14 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 3h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PickaxeIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 4c2.5-2 6-2.7 9.5-1.2M14 2c-2 2.5-2.7 6-1.2 9.5M4.5 6.5 11 13a1.2 1.2 0 0 0 1.7-1.7L6.2 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const stepIcons = [HardwareIcon, BoltIcon, HostingIcon, RewardsIcon]

export function MiningProcess() {
  const { t, i18n } = useTranslation()
  const steps = t('home.miningProcess.steps', { returnObjects: true }) as { num: string; title: string; description: string }[]

  return (
    <section className="relative overflow-hidden bg-[#050505] py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(45,212,191,0.3)] bg-[rgba(20,60,55,0.4)] px-4 py-1.5 text-[10px] font-bold tracking-[0.08em] text-[#2dd4bf] uppercase">
            <span className="size-1.5 rounded-full bg-[#2dd4bf]" />
            {t('home.miningProcess.badge')}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-5 text-[28px] leading-tight font-extrabold text-white sm:text-[32px] md:text-[36px]">
            {t('home.miningProcess.heading1')}{' '}
            <span style={{ backgroundImage: GRADIENT }} className="bg-clip-text text-transparent">
              {t('home.miningProcess.heading2')}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-2 text-[13px] tracking-[0.15em] text-[#9a9a9a] uppercase">
            {t('home.miningProcess.subtitle')}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div
            className="relative mt-10 flex size-16 items-center justify-center rounded-2xl border border-[rgba(232,167,101,0.4)] bg-[#0c0a08]"
            style={{ boxShadow: '0 0 30px rgba(232,167,101,0.3)' }}
          >
            <HexagonIcon className="size-8 text-white/90" />
          </div>
        </Reveal>

        {/* connector flowchart lines — desktop only; mobile falls back to simple stacked cards */}
        <div className="relative hidden w-full max-w-[900px] md:block">
          <svg viewBox="0 0 800 110" preserveAspectRatio="none" className="pointer-events-none h-[110px] w-full" aria-hidden="true">
            <path d="M400 0 V30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
            <path d="M100 30 H700" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
            {[100, 300, 500, 700].map((x) => (
              <path key={x} d={`M${x} 30 V96`} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
            ))}
            <path
              d="M400 0 V18 Q400 30 388 30 H112 Q100 30 100 42"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M400 0 V18 Q400 30 412 30 H688 Q700 30 700 42"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        <div className="mt-2 grid w-full grid-cols-1 gap-8 pt-4 sm:grid-cols-2 md:mt-0 md:gap-5 md:pt-0 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = stepIcons[i]
            return (
              <Reveal key={step.num} delay={260 + i * 90}>
                <div
                  className="relative flex h-full flex-col items-center rounded-[14px] border border-white/6 px-5 pt-8 pb-6 text-center"
                  style={{ background: 'linear-gradient(180deg, #0d0d0d 0%, #1a1512 100%)' }}
                >
                  <div
                    className="absolute -top-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-[rgba(232,167,101,0.4)] bg-[#0c0a08]"
                  >
                    <Icon className="size-3.5 text-[#e8a765]" />
                  </div>
                  <span className="mt-2 text-[11px] font-bold tracking-[0.05em] text-[#e8a765]">{step.num}</span>
                  <h3 className="mt-3 text-[13px] font-bold tracking-[0.05em] text-white uppercase">{step.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[12px] leading-[1.5] text-[#8a8a8a]">{step.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={620}>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('home_mining_process', i18n.language)}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[rgba(232,167,101,0.4)] bg-[#0c0a08] px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#151210] active:scale-95"
            style={{ boxShadow: '0 0 30px rgba(232,167,101,0.25)' }}
          >
            <PickaxeIcon className="size-4 text-[#e8a765]" />
            {t('home.miningProcess.cta')}
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
