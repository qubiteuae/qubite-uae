import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'

const categoryMeta = [
  { image: '/figma/cards/hardware-marketplace.webp', href: '/asic-machines' },
  { image: '/figma/cards/energy-solutions.webp', href: '/hosting' },
]

function ArrowUpRightIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M16 16V0H0M16 0L0 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function EcosystemCategories() {
  const { t } = useTranslation()
  const toLang = useLocalizedPath()
  const categories = (
    t('home.ecosystemCategories.categories', { returnObjects: true }) as { title: string; description: string }[]
  ).map((category, i) => ({ ...category, ...categoryMeta[i] }))

  return (
    <section className="relative overflow-hidden bg-bg">
      <Container className="relative flex flex-col items-center gap-4 py-24 text-center">
        <Reveal>
          <Badge>{t('home.ecosystemCategories.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-[40px] font-bold tracking-tight text-white">{t('home.ecosystemCategories.heading')}</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-[640px] text-base font-bold text-text-subtle">{t('home.ecosystemCategories.paragraph')}</p>
        </Reveal>

        <div className="relative grid w-full max-w-[680px] grid-cols-1 gap-5 pt-16 sm:grid-cols-2">
          {categories.map((category, i) => {
            const cardClassName =
              'group flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#161616] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20'
            const cardContent = (
              <>
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-bold tracking-tight text-white">{category.title}</h3>
                  <p className="text-sm leading-5 text-text-subtle">{category.description}</p>
                  <div className="mt-auto flex justify-end pt-4">
                    <span className="flex size-9 items-center justify-center rounded-full border border-accent-bronze-tint/40 text-accent-bronze-tint transition-all duration-300 group-hover:bg-accent-bronze-tint/10">
                      <ArrowUpRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </>
            )

            return (
              <Reveal key={category.title} delay={i * 90} className="h-full">
                {category.href ? (
                  <Link to={toLang(category.href)} className={cardClassName}>
                    {cardContent}
                  </Link>
                ) : (
                  <div className={cardClassName}>{cardContent}</div>
                )}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
