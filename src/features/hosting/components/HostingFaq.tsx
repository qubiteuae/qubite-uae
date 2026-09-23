import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

function ChevronIcon({ open, className = 'size-4' }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={`${className} transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HostingFaq() {
  const { t } = useTranslation()
  const faqs = t('hosting.faq.items', { returnObjects: true }) as { question: string; answer: string }[]
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative bg-bg py-24">
      <Container className="relative flex flex-col items-center gap-4 text-center">
        <Reveal>
          <Badge>{t('hosting.faq.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[28px] font-bold text-white sm:text-[34px]">{t('hosting.faq.heading')}</h2>
        </Reveal>

        <div className="mt-8 flex w-full max-w-[720px] flex-col gap-3 text-left">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={faq.question} delay={140 + i * 60}>
                <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition-colors hover:text-accent-bronze-tint"
                  >
                    {faq.question}
                    <ChevronIcon open={isOpen} className="size-4 shrink-0 text-text-faint" />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-text-dim">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
