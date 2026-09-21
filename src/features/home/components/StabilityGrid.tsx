import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

export function StabilityGrid() {
  const { t } = useTranslation()
  const cards = t('home.stabilityGrid.cards', { returnObjects: true }) as {
    title: string
    description: string
    transRoute?: string
    ready?: string
    tags?: string[]
  }[]

  return (
    <section className="relative overflow-hidden bg-bg">
      <img
        src="/figma/bento/glow-orange.svg"
        alt=""
        className="pointer-events-none absolute -left-80 top-16 w-[873px] max-w-none opacity-70"
        aria-hidden="true"
      />
      <img
        src="/figma/bento/glow-blue.svg"
        alt=""
        className="pointer-events-none absolute -right-60 -bottom-27 w-[960px] max-w-none opacity-70"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-16 py-30 text-center">
        <div className="flex flex-col items-center gap-6">
          <Reveal>
            <Badge tone="blue">{t('home.stabilityGrid.badge')}</Badge>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="max-w-[800px] text-[38px] leading-tight font-extrabold text-text-heading">
              {t('home.stabilityGrid.heading')}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="max-w-readable text-base text-text-muted">{t('home.stabilityGrid.paragraph')}</p>
          </Reveal>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-8 lg:flex-row">
            <Reveal className="flex flex-1" delay={0}>
              <div className="group flex w-full flex-1 flex-col gap-8 rounded-3xl border-[3px] border-accent-blue bg-black/50 p-10 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_40px_-8px_var(--color-accent-blue)]">
                <div className="flex flex-col items-start gap-4">
                  <span className="flex size-12 items-center justify-center rounded-sm border border-accent-blue bg-white/4 transition-transform duration-300 group-hover:scale-110">
                    <img src="/figma/bento/globe.svg" alt="" className="size-6" />
                  </span>
                  <h3 className="text-xl font-bold text-text-heading">{cards[0].title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{cards[0].description}</p>
                </div>
                <img
                  src="/figma/bento/global-network-wall-map.webp"
                  alt={cards[0].title}
                  loading="lazy"
                  className="h-45 w-full rounded-sm border border-white/4 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div
                className="group flex w-full flex-col justify-between gap-8 rounded-[30px] p-10 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_40px_-10px_var(--color-accent-cyan)] lg:w-110"
                style={{
                  backgroundImage:
                    'linear-gradient(137deg, rgba(114,74,52,0.05) 4%, rgba(23,8,0,0.05) 95%)',
                }}
              >
                <span className="flex size-12 items-center justify-center rounded-sm border border-accent-cyan bg-white/4 transition-transform duration-300 group-hover:scale-110">
                  <img src="/figma/bento/refresh-cw.svg" alt="" className="size-6" />
                </span>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-text-heading">{cards[1].title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{cards[1].description}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-60">
                  <span className="text-[10px] text-accent-blue">{cards[1].transRoute}</span>
                  <span className="text-sm font-bold text-text-heading">{cards[1].ready}</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <Reveal delay={0}>
              <div className="group flex w-full flex-col justify-between gap-8 rounded-3xl border border-border bg-black/[0.02] p-10 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-cyan/40 hover:shadow-[0_0_40px_-10px_var(--color-accent-cyan)] lg:w-110">
                <span className="flex size-12 items-center justify-center rounded-sm border border-accent-cyan bg-white/4 transition-transform duration-300 group-hover:scale-110">
                  <img src="/figma/bento/zap.svg" alt="" className="size-6" />
                </span>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-extrabold text-text-heading">{cards[2].title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{cards[2].description}</p>
                </div>
                <div className="flex gap-2">
                  {(cards[2].tags ?? []).map((label, i) => {
                    const colors = ['text-accent-cyan', 'text-accent-blue', 'text-accent-orange']
                    return (
                      <span
                        key={label}
                        className={`rounded-xs bg-white/6 px-2.5 py-1 text-[11px] transition-colors duration-200 hover:bg-white/12 ${colors[i]}`}
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal className="flex flex-1" delay={100}>
              <div className="group flex w-full flex-1 flex-col gap-8 rounded-3xl border border-border bg-black/50 p-10 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-blue/40 hover:shadow-[0_0_40px_-8px_var(--color-accent-blue)]">
                <div className="flex flex-col items-start gap-4">
                  <span className="flex size-12 items-center justify-center rounded-sm border border-accent-blue bg-white/4 transition-transform duration-300 group-hover:scale-110">
                    <img src="/figma/bento/shield.svg" alt="" className="size-6" />
                  </span>
                  <h3 className="text-xl font-bold text-text-heading">{cards[3].title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{cards[3].description}</p>
                </div>
                <img
                  src="/figma/bento/jurisdiction-analysis-desk.webp"
                  alt={cards[3].title}
                  loading="lazy"
                  className="h-45 w-full rounded-sm border border-white/4 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
