import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { products as catalogProducts } from '@/features/asic-machines/products'
import { WHATSAPP_LINK } from '@/lib/links'

function TickMark() {
  return <span className="inline-block h-[3px] w-8 rounded-full bg-[#ec4899]/70" />
}

function SearchIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 13 10.3 10.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon({ className = 'size-2.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" className={className} fill="none" aria-hidden="true">
      <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FilterIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M2 3h12M4.5 8h7M7 13h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ResetIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M13.5 8A5.5 5.5 0 1 1 11.8 4M13.5 2v3.5H10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarIcon({ filled, className = 'size-4' }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M8 1.5 9.9 5.6l4.5.6-3.3 3.1.8 4.4L8 11.6l-4 2.1.8-4.4-3.3-3.1 4.5-.6L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SortIcon({ direction, className = 'size-3' }: { direction: 'asc' | 'desc' | null; className?: string }) {
  return (
    <svg viewBox="0 0 10 14" className={className} fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5 5 2l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'asc' ? 1 : 0.35}
      />
      <path
        d="M2.5 9.5 5 12l2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'desc' ? 1 : 0.35}
      />
    </svg>
  )
}

function HeadsetIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 8.5V7a5 5 0 0 1 10 0v1.5M3 8.5v3a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3Zm10 0v3a1 1 0 0 1-1 1h-.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1H13Zm-1 4.5v.5a1.5 1.5 0 0 1-1.5 1.5H8.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface Miner {
  id: string
  slug: string
  model: string
  release: string
  releaseSort: number
  hashrate: string
  hashrateSort: number
  power: string
  powerSort: number
  top: { letter: string; color: string }
  algorithm: string
  price: number
  priceDisplay: string
  priceWasDisplay: string
}

const brandBadge: Record<string, { letter: string; color: string }> = {
  MicroBT: { letter: 'M', color: '#f97316' },
  Bitmain: { letter: 'B', color: '#f59e0b' },
}

// Splits a formatted price like "Dh 3,000" or "$6,800" into its currency
// prefix and numeric value, so a "was" price can be synthesized in the same
// currency for the struck-through comparison line.
function splitPrice(display: string): { prefix: string; amount: number } {
  const match = display.match(/^([^\d]*)([\d,]+)/)
  const prefix = match?.[1] ?? '$'
  const amount = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  return { prefix, amount }
}

// Repeats the 3 real products to fill out the table for demo purposes —
// swap back to `baseProducts` once the catalog has more real listings.
const miners: Miner[] = catalogProducts.map((product, i) => {
  const { prefix, amount } = splitPrice(product.price)
  const wasAmount = Math.round((amount * 1.15) / 10) * 10
  return {
    id: `${product.slug}-${i}`,
    slug: product.slug,
    model: product.title,
    release: product.specs.release,
    releaseSort: product.specs.release === 'Latest Batch' ? Date.now() : new Date(product.specs.release).getTime(),
    hashrate: product.hashrate,
    hashrateSort: product.hashrateValue,
    power: product.power,
    powerSort: product.powerValue,
    top: brandBadge[product.brand] ?? { letter: product.brand[0], color: '#a855f7' },
    algorithm: product.algorithm,
    price: product.priceUsd,
    priceDisplay: product.price,
    priceWasDisplay: `${prefix}${wasAmount.toLocaleString()}`,
  }
})

type SortKey = 'model' | 'releaseSort' | 'hashrateSort' | 'powerSort' | 'price'

export function AsicComparison() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // Order matches the visual column order in the table exactly; `key` is
  // omitted for the two non-sortable columns (Top, Algorithm).
  const columns: { key: SortKey | null; label: string }[] = [
    { key: 'model', label: t('home.asicComparison.columns.model') },
    { key: 'releaseSort', label: t('home.asicComparison.columns.release') },
    { key: 'hashrateSort', label: t('home.asicComparison.columns.hashrate') },
    { key: 'powerSort', label: t('home.asicComparison.columns.power') },
    { key: null, label: t('home.asicComparison.columns.top') },
    { key: null, label: t('home.asicComparison.columns.algorithm') },
    { key: 'price', label: t('home.asicComparison.columns.bestPrice') },
  ]

  const filterPills = [
    t('home.asicComparison.filterPills.category'),
    t('home.asicComparison.filterPills.cooling'),
    t('home.asicComparison.filterPills.manufacturer'),
    t('home.asicComparison.filterPills.algorithm'),
  ]
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)

  const rows = useMemo(() => {
    let list = miners.filter((m) => m.model.toLowerCase().includes(query.toLowerCase()))
    if (sort) {
      list = [...list].sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
        return sort.direction === 'asc' ? cmp : -cmp
      })
    }
    return list
  }, [query, sort])

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,68,64,0.28), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-3 text-center">
        <Reveal>
          <TickMark />
        </Reveal>
        <Reveal delay={60}>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[rgba(96,165,250,0.3)] bg-[rgba(59,130,246,0.15)] px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-[#93c5fd] uppercase">
            {t('home.asicComparison.badge')}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="max-w-[700px] text-[28px] font-extrabold text-white sm:text-[34px]">
            {t('home.asicComparison.heading')}
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="max-w-[560px] text-sm text-text-dim">{t('home.asicComparison.paragraph')}</p>
        </Reveal>
        <Reveal delay={240}>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(232,167,101,0.4)] bg-[#0c0a08] px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#151210] active:scale-95"
            style={{ boxShadow: '0 0 30px rgba(232,167,101,0.25)' }}
          >
            <HeadsetIcon className="size-4 text-[#e8a765]" />
            {t('home.asicComparison.talkToHuman')}
          </a>
        </Reveal>

        <Reveal delay={300} className="mt-10 w-full">
          <div className="rounded-2xl border border-white/8 bg-[rgba(10,14,13,0.7)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {filterPills.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-text-dim transition-colors hover:border-white/25 hover:text-white"
                >
                  {label}
                  <ChevronDownIcon className="text-text-faint" />
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <SearchIcon className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-subtle" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.asicComparison.searchPlaceholder')}
                  className="w-full rounded-full border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-text-faint focus:border-accent-cyan/40 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2.5 text-xs font-semibold text-text-dim transition-colors hover:border-white/25 hover:text-white"
              >
                <FilterIcon />
                {t('home.asicComparison.advancedFilters')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSort(null)
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2.5 text-xs font-semibold text-text-dim transition-colors hover:border-white/25 hover:text-white"
              >
                <ResetIcon />
                {t('home.asicComparison.reset')}
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/8 text-[10px] tracking-wide text-text-faint uppercase">
                    <th className="px-2 py-2 font-medium">{t('home.asicComparison.columns.fav')}</th>
                    {columns.map((col) =>
                      col.key ? (
                        <th key={col.label} className="px-2 py-2 font-medium">
                          <button
                            type="button"
                            onClick={() => toggleSort(col.key as SortKey)}
                            className="inline-flex items-center gap-1 transition-colors hover:text-white"
                          >
                            {col.label}
                            <SortIcon direction={sort?.key === col.key ? sort.direction : null} />
                          </button>
                        </th>
                      ) : (
                        <th key={col.label} className="px-2 py-2 font-medium">
                          {col.label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((miner) => (
                    <tr
                      key={miner.id}
                      onClick={() => navigate(`/asic-machines/${miner.slug}`)}
                      className="cursor-pointer border-b border-white/4 text-sm transition-colors hover:bg-white/3"
                    >
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(miner.id)
                          }}
                          className={`transition-colors ${favorites.has(miner.id) ? 'text-[#e8a765]' : 'text-text-faint hover:text-white'}`}
                          aria-label="Toggle favorite"
                        >
                          <StarIcon filled={favorites.has(miner.id)} />
                        </button>
                      </td>
                      <td className="max-w-[180px] truncate px-2 py-3 font-semibold text-white">{miner.model}</td>
                      <td className="px-2 py-3 whitespace-nowrap text-[#2dd4bf]">{miner.release}</td>
                      <td className="px-2 py-3 whitespace-nowrap tabular-nums text-white">{miner.hashrate}</td>
                      <td className="px-2 py-3 whitespace-nowrap tabular-nums text-text-dim">{miner.power}</td>
                      <td className="px-2 py-3">
                        <span
                          className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: miner.top.color }}
                        >
                          {miner.top.letter}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-text-dim">{miner.algorithm}</td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-text-faint line-through">{miner.priceWasDisplay}</span>
                          <span className="font-bold tabular-nums text-[#f5a623]">{miner.priceDisplay}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-2 py-8 text-center text-sm text-text-faint">
                        {t('home.asicComparison.noResults')}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
