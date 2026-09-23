import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { useCountUp } from '@/hooks/useCountUp'
import { useInView } from '@/hooks/useInView'

const stats = [
  { value: '1,500+ PH', label: 'Total Hashrate', icon: '/figma/stats/bolt.svg' },
  { value: '98.7%', label: 'Uptime', icon: '/figma/stats/check-circle.svg' },
  { value: '1.87 BTC', label: 'Daily BTC Mined', icon: '/figma/stats/dollar-sign.svg' },
  { value: '6', label: 'Global Operations', icon: '/figma/stats/globe.svg' },
]

function StatItem({ value, label, icon, isLast }: (typeof stats)[number] & { isLast: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const display = useCountUp(value, inView)

  return (
    <div ref={ref} className="flex items-center">
      <div className="group flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-sm border border-accent-copper bg-accent-copper/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-copper/25 group-hover:shadow-[0_0_20px_-4px_var(--color-accent-copper)]">
          <img src={icon} alt="" className="h-6 w-[22px]" />
        </span>
        <span className="flex flex-col items-center gap-4">
          <span className="font-mono text-[36px] font-bold tracking-tight whitespace-nowrap tabular-nums text-[#f0f2f5] md:text-[48px]">
            {display}
          </span>
          <span className="text-[13px] tracking-wide text-accent-copper">{label}</span>
        </span>
      </div>
      {!isLast ? <span className="ml-8 hidden h-16 w-px bg-white/10 md:ml-16 lg:block" /> : null}
    </div>
  )
}

// The lg: offsets below are taken directly from the Figma frame (fintech-landing-page,
// node 0:73) measured from the section's own top, so the curve/stats/heading sit
// exactly where Figma places them on desktop:
//   stats-section   top 160px  (h-[342px] frame, pt-[160px])
//   earth-horizon   top 405px, 1620×668 — only the top half (the rising arc) is
//                    shown; the shape is a full closed oval, but the page only
//                    ever reveals the upper dome as a horizon, so it's clipped
//                    to its own vertical midpoint (334px) here.
//   header-zone     top 641px  (badge/heading/paragraph, 202px tall)
// Below the lg breakpoint there isn't enough width for that absolute layout to hold
// together (it was overlapping badly on mobile), so everything falls back to normal
// stacked flow and the curve becomes a smaller, roughly-centered decorative backdrop.
export function StatsBar() {
  return (
    <section className="relative overflow-hidden bg-black lg:min-h-[1100px]">
      <div className="absolute inset-x-0 top-20 h-[300px] overflow-hidden sm:top-28 sm:h-[360px] lg:top-[405px] lg:h-[434px]">
        <img
          src="/figma/stats/earth-horizon.svg"
          alt=""
          className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[1460px] max-w-none -translate-x-1/2 opacity-70 sm:h-[720px] sm:w-[1750px] lg:h-[868px] lg:w-[2106px] lg:opacity-80"
          aria-hidden="true"
        />
      </div>

      <Container className="relative flex flex-col items-center gap-10 pt-16 pb-4 lg:absolute lg:inset-x-0 lg:top-[160px] lg:flex-row lg:flex-wrap lg:justify-center lg:gap-x-16 lg:gap-y-10 lg:pt-0 lg:pb-0">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} {...stat} isLast={i === stats.length - 1} />
        ))}
      </Container>

      <Container className="relative flex flex-col items-center gap-6 pt-24 pb-16 text-center lg:absolute lg:inset-x-0 lg:top-[641px] lg:gap-7 lg:pt-0 lg:pb-0">
        <Reveal>
          <Badge>Fastest Deployment in the Market</Badge>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-[32px] font-black text-[#f0f2f5] sm:text-[40px] md:text-[64px]">
            Go Live in{' '}
            <span className="bg-gradient-to-r from-accent-bronze-tint to-accent-copper bg-clip-text text-transparent">
              24 Hours
            </span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="max-w-[772px] text-base text-text-dim md:text-lg">
            Hardware deployed and operational within 24 hours of confirmation. Maximize your
            compute capability without overhead friction.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
