import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

function BoltIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M9 1.5 3 9h4l-1 5.5 6-7.5H8l1-5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function RackIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <rect x="2.5" y="1.5" width="11" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 4.5h7M4.5 7.5h7M4.5 10.5h7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function SnowflakeIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 1v14M2.5 4l11 8M13.5 4l-11 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MonitorIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 8 6.5 5.5 8.5 7.5 12 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M8 1.5 13.5 3.5V7.5C13.5 11 11 13.3 8 14.5C5 13.3 2.5 11 2.5 7.5V3.5L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function TruckIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M1.5 4h7v7h-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8.5 7h3l2 2.5V11h-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="4" cy="12.5" r="1.3" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="11.5" cy="12.5" r="1.3" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

const includedIcons = [BoltIcon, RackIcon, SnowflakeIcon, MonitorIcon, ShieldIcon, TruckIcon]

export function WhatsIncluded() {
  const { t } = useTranslation()
  const included = t('hosting.whatsIncluded.items', { returnObjects: true }) as { title: string; description: string }[]

  return (
    <section className="relative overflow-hidden bg-black py-24">
      <Container className="relative flex flex-col items-center gap-4 text-center">
        <Reveal>
          <Badge>{t('hosting.whatsIncluded.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-[28px] font-bold text-white sm:text-[34px]">{t('hosting.whatsIncluded.heading')}</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[560px] text-sm text-text-dim">{t('hosting.whatsIncluded.paragraph')}</p>
        </Reveal>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item, i) => {
            const Icon = includedIcons[i]
            return (
              <Reveal key={item.title} delay={200 + i * 70}>
                <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-white/8 bg-white/3 p-6 text-left">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-accent-bronze-tint/35 bg-accent-bronze-tint/10 text-accent-bronze-tint">
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
