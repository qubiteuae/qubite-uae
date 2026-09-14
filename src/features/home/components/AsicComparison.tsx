import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { products as catalogProducts } from '@/features/asic-machines/products'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'

function TickMark() {
  return <span className="inline-block h-[3px] w-8 rounded-full bg-[#ec4899]/70" />
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
}

const brandBadge: Record<string, { letter: string; color: string }> = {
  MicroBT: { letter: 'M', color: '#f97316' },
  Bitmain: { letter: 'B', color: '#f59e0b' },
}

// Full real catalogue — column headers are sortable, so there's no separate
// filter/search UI needed here (that lives on the dedicated /asic-machines page).
const miners: Miner[] = catalogProducts.map((product, i) => ({
  id: `${product.slug}-${i}`,
  slug: product.slug,
  model: product.title,
  release: product.specs.release,
  releaseSort: product.specs.release === 'Latest Batch' ? Date.now() : new Date(product.specs.release).getTime(),
  hashrate: product.hashrate,
  hashrateSort: product.hashrateValue ?? 0,
  power: product.power,
  powerSort: product.powerValue,
  top: brandBadge[product.brand] ?? { letter: product.brand[0], color: '#a855f7' },
  algorithm: product.algorithm,
  price: product.priceUsd ?? Infinity,
  priceDisplay: product.price,
}))

type SortKey = 'model' | 'releaseSort' | 'hashrateSort' | 'powerSort' | 'price'

export function AsicComparison() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const toLang = useLocalizedPath()

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

  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)

  const rows = useMemo(() => {
    if (!sort) return miners
    return [...miners].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
      return sort.direction === 'asc' ? cmp : -cmp
    })
  }, [sort])

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
            onClick={() => trackWhatsAppClick('home_asic_comparison', i18n.language)}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(232,167,101,0.4)] bg-[#0c0a08] px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#151210] active:scale-95"
            style={{ boxShadow: '0 0 30px rgba(232,167,101,0.25)' }}
          >
            <HeadsetIcon className="size-4 text-[#e8a765]" />
            {t('home.asicComparison.talkToHuman')}
          </a>
        </Reveal>

        <Reveal delay={300} className="mt-10 w-full">
          <div className="rounded-2xl border border-white/8 bg-[rgba(10,14,13,0.7)] p-4 sm:p-5">
            <div className="styled-scrollbar max-h-[260px] overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[#0c0f0e]">
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
                      onClick={() => navigate(toLang(`/asic-machines/${miner.slug}`))}
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
                          <span className="font-bold tabular-nums text-[#f5a623]">{miner.priceDisplay}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-text-faint">{t('home.asicComparison.disclaimer')}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
