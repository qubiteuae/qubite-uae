import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

// Single brand tone for every "eyebrow" badge on the site — this used to take
// a tone prop (blue | bronze) but the label text was hardcoded to cyan
// regardless, so a "bronze" badge still showed cyan text/dot. Rather than
// wire up a second correct color, standardizing on one tone: every eyebrow
// badge across every page now looks identical, which is the point of a
// shared component.
export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`group inline-flex items-center gap-2 rounded-pill border border-accent-bronze-tint/20 bg-accent-bronze-tint/8 px-4 py-2 text-[12px] font-bold tracking-wide text-accent-bronze-tint uppercase transition-colors duration-200 hover:bg-current/10 ${className}`}
    >
      <span className="relative flex size-1.5 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-75" />
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      {children}
    </span>
  )
}
