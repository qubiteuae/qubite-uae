import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

const points = [
  {
    title: 'Multi-country deployment.',
    description:
      'Spread capacity across regions so a single grid event or policy change never takes the whole fleet offline.',
  },
  {
    title: 'Portable hardware.',
    description: 'Machines are provisioned to relocate between sites in days, not months, as power terms shift.',
  },
  {
    title: 'Diversified power sourcing.',
    description:
      'Sites draw from a mix of grid, gas, and solar contracts to keep uptime independent of any one supplier.',
  },
]

export function StabilityHighlight() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <img
        src="/figma/resilience/glow-orange.svg"
        alt=""
        className="pointer-events-none absolute left-45 top-55 w-[873px] max-w-none opacity-70"
        aria-hidden="true"
      />
      <img
        src="/figma/resilience/glow-blue.svg"
        alt=""
        className="pointer-events-none absolute -right-60 bottom-16 w-[960px] max-w-none opacity-70"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-16 py-30 text-center">
        <div className="flex flex-col items-center gap-6">
          <Reveal>
            <Badge tone="blue">Built for resilience</Badge>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="max-w-[800px] text-[38px] leading-tight font-bold text-text-heading">
              Designed for Stability in a Changing World
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="max-w-[770px] text-base text-text-muted">
              Geopolitical uncertainty doesn&apos;t stop when you plug in a miner. That&apos;s why
              we deploy infrastructure across multiple jurisdictions — so your operations stay
              online regardless of what happens in any single country.
            </p>
          </Reveal>
        </div>

        <div className="flex w-full flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-center">
          <Reveal className="flex shrink-0 justify-center lg:w-122">
            <img
              src="/figma/resilience/portrait.webp"
              alt="Qubite mining facility"
              loading="lazy"
              className="h-[420px] w-auto rotate-[10deg] object-bottom transition-transform duration-500 hover:rotate-[6deg] hover:scale-[1.03]"
            />
          </Reveal>

          <div className="flex w-full max-w-160 flex-col items-start gap-8 text-left">
            <Reveal delay={100}>
              <div className="flex flex-col gap-4">
                <h3 className="text-[38px] leading-tight font-bold text-white">
                  One region going dark shouldn&apos;t stop your fleet
                </h3>
                <p className="text-base text-[#8a8f9f]">
                  Capacity is spread on purpose, so no single site, supplier, or jurisdiction is a
                  single point of failure.
                </p>
              </div>
            </Reveal>

            <div className="flex w-full flex-col gap-10 rounded-[16px] border border-white/7 bg-white/2 p-6">
              {points.map((point, i) => (
                <Reveal key={point.title} delay={200 + i * 100}>
                  <div className="group flex items-start gap-4">
                    <span className="mt-1.5 size-2 shrink-0 rounded-[1px] bg-accent-copper transition-transform duration-300 group-hover:scale-125" />
                    <p className="text-sm text-[#8a8f9f]">
                      <span className="font-bold text-white">{point.title} </span>
                      {point.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
