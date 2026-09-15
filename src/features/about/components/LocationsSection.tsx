import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

const uaeSitePhotos = [
  '/locations/abu-dhabi-building.webp',
  '/locations/abu-dhabi-hall.webp',
  '/locations/abu-dhabi-container.webp',
]

export function LocationsSection() {
  const { t } = useTranslation()
  const stats = t('about.locations.stats', { returnObjects: true }) as { label: string; value: string }[]
  const uaeSites = (t('about.locations.uaeSites', { returnObjects: true }) as { name: string }[]).map((site, i) => ({
    ...site,
    photo: uaeSitePhotos[i],
  }))
  const lifecycle = t('about.locations.lifecycle.steps', { returnObjects: true }) as string[]

  return (
    <section id="locations" className="relative overflow-hidden bg-black py-24 scroll-mt-20">
      <Container className="relative flex flex-col items-center gap-4 text-center">
        <Reveal>
          <Badge tone="bronze">{t('about.locations.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[28px] font-bold text-white sm:text-[34px]">{t('about.locations.heading')}</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[640px] text-sm text-text-dim">{t('about.locations.paragraph')}</p>
        </Reveal>

        <div className="mt-8 grid w-full max-w-[1000px] grid-cols-1 gap-5 text-left sm:grid-cols-2">
          <Reveal delay={200} className="h-full">
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-[rgba(232,167,101,0.35)] bg-[rgba(232,167,101,0.06)] p-6">
              <img
                src="/locations/abu-dhabi-building.webp"
                alt="United Arab Emirates facility"
                className="h-40 w-full rounded-xl object-cover"
              />
              <h3 className="text-base font-bold text-white">{t('about.locations.uae.title')}</h3>
              <p className="text-xs leading-relaxed text-text-dim">{t('about.locations.uae.description')}</p>
              <span className="text-[11px] font-bold tracking-wide text-accent-bronze-tint uppercase">
                {t('about.locations.uae.tag')}
              </span>
            </div>
          </Reveal>

          <Reveal delay={280} className="h-full">
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6">
              <img
                src="/locations/server-racks.webp"
                alt="Germany and Switzerland facility"
                className="h-40 w-full rounded-xl object-cover"
              />
              <h3 className="text-base font-bold text-white">{t('about.locations.europe.title')}</h3>
              <p className="text-xs leading-relaxed text-text-dim">{t('about.locations.europe.description')}</p>
              <span className="text-[11px] font-bold tracking-wide text-text-subtle uppercase">
                {t('about.locations.europe.tag')}
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={320} className="mt-6">
          <span className="text-[11px] font-bold tracking-[0.08em] text-accent-bronze-tint uppercase">
            {t('about.locations.statsLabel')}
          </span>
        </Reveal>

        <div className="mt-2 grid w-full max-w-[1000px] grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={340 + i * 60}>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/8 bg-white/3 py-5">
                <span className="text-xl font-black text-[#e8a765]">{stat.value}</span>
                <span className="text-[10px] font-medium tracking-wide text-text-faint uppercase">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="max-w-[560px] text-[11px] text-text-faint">{t('about.locations.statsDisclaimer')}</p>

        <Reveal delay={420} className="mt-10 w-full">
          <h3 className="text-lg font-bold text-white">{t('about.locations.uaeSitesHeading')}</h3>
        </Reveal>

        <div className="mt-4 grid w-full max-w-[720px] grid-cols-2 gap-4 sm:grid-cols-3">
          {uaeSites.map((site, i) => (
            <Reveal key={site.name} delay={460 + i * 80}>
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/8">
                <img
                  src={site.photo}
                  alt={site.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                  aria-hidden="true"
                />
                <span className="absolute bottom-3 left-3 text-sm font-bold text-white">{site.name}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={720} className="mt-12 w-full max-w-[1000px]">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/8 bg-white/3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-sm font-bold text-white">{t('about.locations.lifecycle.title')}</h3>
              <p className="text-xs text-text-dim">{t('about.locations.lifecycle.description')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {lifecycle.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-text-subtle">
                    <span className="flex size-4 items-center justify-center rounded-full bg-accent-bronze-tint/20 text-[9px] text-accent-bronze-tint">
                      {i + 1}
                    </span>
                    {step}
                  </span>
                  {i < lifecycle.length - 1 ? <span className="text-text-faint">→</span> : null}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
