import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

export function AboutHero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(232,167,101,0.18), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-5 pt-30 pb-20 text-center md:pt-36">
        <Reveal>
          <Badge>{t('about.hero.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="max-w-[760px] text-[36px] leading-tight font-black text-white sm:text-[48px]">
            {t('about.hero.heading')}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[640px] text-base text-text-dim md:text-lg">{t('about.hero.paragraph')}</p>
        </Reveal>
      </Container>
    </section>
  )
}
