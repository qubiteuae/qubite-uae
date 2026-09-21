import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

const steps = [
  {
    num: '01',
    title: 'ASIC hardware initialization',
    description: 'Auto-detect hashrate capacity',
    icon: '/figma/deploy/check-circle.svg',
    numColor: 'text-white',
    numBg: 'bg-[rgba(0,229,255,0.08)] border-[rgba(0,229,255,0.3)] shadow-[0_0_16px_0_rgba(0,229,255,0.2)]',
    cardBg: 'bg-[rgba(0,229,255,0.04)] border-[rgba(52,234,255,0.29)] shadow-[0_4px_24px_0_rgba(0,229,255,0.12)]',
    line: '#34eaff',
  },
  {
    num: '02',
    title: 'Deploy to mining facility',
    description: 'Rack-mount ASIC unit configuration',
    icon: '/figma/deploy/map-pin.svg',
    numColor: 'text-[#2979ff]',
    numBg: 'bg-[rgba(41,121,255,0.1)] border-[rgba(41,121,255,0.35)] shadow-[0_0_16px_0_rgba(41,121,255,0.25)]',
    cardBg: 'bg-[rgba(41,121,255,0.05)] border-[rgba(79,145,255,0.34)] shadow-[0_4px_24px_0_rgba(41,121,255,0.15)]',
    line: '#2979ff',
  },
  {
    num: '03',
    title: 'Zero delays. Zero idle time.',
    description: 'Always-on, always ready',
    icon: '/figma/deploy/zap.svg',
    numColor: 'text-accent-bronze-tint',
    numBg: 'bg-accent-copper/15 border-accent-copper/40',
    cardBg: 'bg-white/[0.02] border-accent-copper/40 shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]',
    line: '#a46a4b',
  },
]

export function DeploymentFlow() {
  return (
    <section className="bg-black">
      <Container className="flex flex-col items-center pb-24 text-center">
        <div className="relative flex w-full flex-col items-center">
          <div className="animate-float relative z-10 size-[130px] shrink-0 rounded-[46px] shadow-[0_0_40px_8px_#7f543d] transition-shadow duration-500 hover:shadow-[0_0_60px_14px_#7f543d] md:size-[209px]">
            <img src="/figma/deploy/cube.webp" alt="" loading="lazy" className="size-full rounded-[46px] object-cover" />
          </div>

          <div className="relative w-full">
            <svg
              viewBox="0 0 300 90"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-[90px] w-full md:block"
              aria-hidden="true"
            >
              <path d="M150 0 V90" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
              <path
                d="M150 0 V22 Q150 34 138 34 H62 Q50 34 50 46 V90"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M150 0 V22 Q150 34 162 34 H238 Q250 34 250 46 V90"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="50" cy="90" r="3" fill={steps[0].line} />
              <circle cx="150" cy="90" r="3" fill={steps[1].line} />
              <circle cx="250" cy="90" r="3" fill={steps[2].line} />
            </svg>

            <div className="relative grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-3 md:pt-[70px]">
              {steps.map((step, i) => (
                <Reveal key={step.num} delay={i * 120}>
                  <div
                    className={`group flex items-center gap-5 rounded-[16px] border px-6 py-5 text-left backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1.5 ${step.cardBg}`}
                  >
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-sm border transition-transform duration-300 group-hover:scale-110 ${step.numBg}`}
                    >
                      <span className={`font-mono text-lg font-extrabold ${step.numColor}`}>{step.num}</span>
                    </span>
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="text-[15px] font-semibold text-[#f0f2f5]">{step.title}</span>
                      <span className="text-xs text-white/40">{step.description}</span>
                    </span>
                    <img
                      src={step.icon}
                      alt=""
                      loading="lazy"
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-125"
                    />
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
