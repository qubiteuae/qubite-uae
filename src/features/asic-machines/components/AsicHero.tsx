import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

export function AsicHero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-bg">
      <img src="/hero-bg.webp" alt="" className="absolute inset-0 size-full object-cover" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(20,10,5,0.1) 0%, rgba(10,5,3,0.4) 55%, rgba(9,9,9,0.8) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 55%, var(--color-bg) 100%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative flex min-h-[660px] flex-col items-center justify-center gap-6 pt-32 pb-20 text-center">
        <Reveal>
          <Badge className="backdrop-blur-sm">
            {t('asicMachines.hero.badge')}
          </Badge>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="max-w-[860px] text-[44px] leading-[1.1] font-black text-white md:text-[58px]">
            {t('asicMachines.hero.heading1')}
            <br />
            <span className="bg-gradient-to-r from-accent-bronze-tint to-accent-copper bg-clip-text text-transparent">
              {t('asicMachines.hero.heading2')}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[680px] text-base leading-relaxed text-text-dim">{t('asicMachines.hero.paragraph')}</p>
        </Reveal>
      </Container>
    </section>
  )
}
