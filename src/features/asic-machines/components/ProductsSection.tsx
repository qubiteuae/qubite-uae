import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { type Brand, type Category, type Product, products } from '@/features/asic-machines/products'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'
import {
  ChevronDownIcon,
  EfficiencyIcon,
  HashrateIcon,
  PowerIcon,
  SearchIcon,
  WhatsAppIcon,
} from './icons'

type SortOption =
  | 'None'
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'Hashrate: High to Low'
  | 'Power: Low to High'
  | 'Efficiency: Best First'

function parseLeadingNumber(value: string): number {
  const match = value.replace(/,/g, '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

// Joules per single hash/sol — the only way to compare "efficiency" across
// products whose native units (J/TH, J/MH, J/M, J/KSol) aren't otherwise
// comparable. Lower is more efficient.
function efficiencyPerHz(product: Product): number {
  if (!product.hashrateHz) return Infinity
  return product.powerValue / product.hashrateHz
}

const uniqueSorted = <T,>(values: T[]): T[] => Array.from(new Set(values)).sort()

const cardFont = { fontFamily: 'Inter, system-ui, sans-serif' }

function ProductMedia({ media, title }: { media: Product['media']; title: string }) {
  return media.type === 'image' ? (
    <img
      src={media.src}
      alt={title}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  ) : (
    <video
      src={media.src}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      autoPlay
      muted
      loop
      playsInline
    />
  )
}

function ProductCard({ product, delay }: { product: Product; delay: number }) {
  const { t, i18n } = useTranslation()
  const toLang = useLocalizedPath()
  const inStock = product.status === 'In Stock'

  return (
    <Reveal delay={delay}>
      <div
        className="group mx-auto flex h-full w-full max-w-[380px] flex-col rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[#17130f] p-4 transition-transform duration-300 hover:-translate-y-1.5"
        style={{
          ...cardFont,
          boxShadow: '0 0 40px rgba(120,80,40,0.15), 0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* image area */}
        <Link
          to={toLang(`/asic-machines/${product.slug}`)}
          className="relative h-[220px] overflow-hidden rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse at center, #2a1f16 0%, #150f0a 60%, #0a0a0a 100%)',
          }}
        >
          {/* faint tech-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(232,167,101,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,167,101,1) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
            aria-hidden="true"
          />

          {/* stock badge — omitted when stock status isn't known */}
          {product.status ? (
            <span
              className={`absolute top-3 right-3 z-10 rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.05em] uppercase ${
                inStock
                  ? 'border-[rgba(74,222,128,0.3)] bg-[rgba(34,197,94,0.12)] text-[#4ade80]'
                  : 'border-[rgba(248,113,113,0.3)] bg-[rgba(239,68,68,0.12)] text-[#f87171]'
              }`}
            >
              {inStock ? t('asicMachines.products.inStock') : t('asicMachines.products.noStock')}
            </span>
          ) : null}

          {/* glowing diamond platform */}
          <div
            className="pointer-events-none absolute bottom-10 left-1/2 size-24 -translate-x-1/2 rotate-45 rounded-md bg-[#e8a765]/25"
            style={{ filter: 'blur(32px)' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-11 left-1/2 size-16 -translate-x-1/2 rotate-45 rounded-sm border border-[#e8a765]/30 bg-[#e8a765]/10"
            aria-hidden="true"
          />

          <ProductMedia media={product.media} title={product.title} />

          {/* bottom vignette */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }}
            aria-hidden="true"
          />
        </Link>

        {/* title */}
        <Link to={toLang(`/asic-machines/${product.slug}`)}>
          <h3 className="mt-3.5 line-clamp-2 min-h-[44px] text-[17px] leading-[1.3] font-semibold text-white transition-colors hover:text-accent-bronze-tint">
            {product.title}
          </h3>
        </Link>

        {/* tag + price */}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="rounded-full bg-[rgba(232,167,101,0.12)] px-3 py-1 text-[10px] font-bold tracking-[0.04em] text-accent-bronze-tint uppercase">
            {product.tag}
          </span>
          <span
            className={
              product.priceUsd === null
                ? 'text-[13px] font-bold text-[#f5a623]'
                : 'font-mono text-[20px] font-bold tabular-nums text-[#f5a623]'
            }
          >
            {product.price}
          </span>
        </div>

        {/* divider */}
        <div className="my-3.5 h-px bg-[rgba(255,255,255,0.08)]" />

        {/* specs row */}
        <div className="grid grid-cols-3">
          <div className="relative flex flex-col items-center gap-1 after:absolute after:top-[15%] after:right-0 after:h-[70%] after:w-px after:bg-[rgba(255,255,255,0.08)] after:content-['']">
            <span className="flex items-center gap-1 text-[10px] font-medium tracking-[0.04em] text-[#6b7280] uppercase">
              <HashrateIcon className="size-3 text-accent-steel" />
              {t('asicMachines.products.hashrate')}
            </span>
            <span className="mt-1 font-mono text-[14px] font-semibold tabular-nums text-white">{product.hashrate}</span>
          </div>
          <div className="relative flex flex-col items-center gap-1 after:absolute after:top-[15%] after:right-0 after:h-[70%] after:w-px after:bg-[rgba(255,255,255,0.08)] after:content-['']">
            <span className="flex items-center gap-1 text-[10px] font-medium tracking-[0.04em] text-[#6b7280] uppercase">
              <EfficiencyIcon className="size-3 text-accent-steel" />
              {t('asicMachines.products.efficiency')}
            </span>
            <span className="mt-1 font-mono text-[14px] font-semibold tabular-nums text-white">{product.efficiency}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-1 text-[10px] font-medium tracking-[0.04em] text-[#6b7280] uppercase">
              <PowerIcon className="size-3 text-accent-steel" />
              {t('asicMachines.products.power')}
            </span>
            <span className="mt-1 font-mono text-[14px] font-semibold tabular-nums text-white">{product.power}</span>
          </div>
        </div>

        {/* buttons */}
        <div className="mt-3.5 flex flex-col items-center gap-2">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(`products_section_card:${product.slug}`, i18n.language)}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#22c55e] to-[#16a34a] py-3 text-[13px] font-bold tracking-[0.03em] text-white uppercase transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ boxShadow: '0 4px 14px rgba(34,197,94,0.3)' }}
          >
            <WhatsAppIcon className="size-3.5" />
            {t('asicMachines.products.whatsapp')}
          </a>
          <Link
            to={toLang(`/asic-machines/${product.slug}`)}
            className="text-[12px] font-semibold text-text-faint underline-offset-2 transition-colors hover:text-accent-bronze-tint hover:underline"
          >
            {t('asicMachines.products.viewDetails')}
          </Link>
        </div>
      </div>
    </Reveal>
  )
}

export function ProductsSection() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [brand, setBrand] = useState<Brand | 'All'>('All')
  const [coin, setCoin] = useState<string>('All')
  const [algorithm, setAlgorithm] = useState<string>('All')
  const [sort, setSort] = useState<SortOption>('None')
  const [query, setQuery] = useState('')

  const brandOptions = useMemo(() => uniqueSorted(products.map((p) => p.brand)), [])
  const coinOptions = useMemo(
    () => uniqueSorted(products.flatMap((p) => p.mineableCoins.map((c) => c.ticker))),
    [],
  )
  const algorithmOptions = useMemo(() => uniqueSorted(products.map((p) => p.algorithm)), [])

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = products.filter((product) => {
      if (category !== 'All' && product.category !== category) return false
      if (brand !== 'All' && product.brand !== brand) return false
      if (coin !== 'All' && !product.mineableCoins.some((c) => c.ticker === coin)) return false
      if (algorithm !== 'All' && product.algorithm !== algorithm) return false
      if (q && !product.title.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) {
        return false
      }
      return true
    })

    if (sort === 'Price: Low to High') {
      result.sort((a, b) => parseLeadingNumber(a.price) - parseLeadingNumber(b.price))
    } else if (sort === 'Price: High to Low') {
      result.sort((a, b) => parseLeadingNumber(b.price) - parseLeadingNumber(a.price))
    } else if (sort === 'Hashrate: High to Low') {
      result.sort((a, b) => (b.hashrateHz ?? 0) - (a.hashrateHz ?? 0))
    } else if (sort === 'Power: Low to High') {
      result.sort((a, b) => a.powerValue - b.powerValue)
    } else if (sort === 'Efficiency: Best First') {
      result.sort((a, b) => efficiencyPerHz(a) - efficiencyPerHz(b))
    }

    return result
  }, [category, brand, coin, algorithm, sort, query])

  return (
    <section className="relative overflow-hidden bg-bg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(74,47,31,0.55) 0%, rgba(40,24,15,0.35) 35%, rgba(9,9,9,0) 100%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col gap-8 py-16">
        <Reveal>
          <div className="flex flex-col gap-1 text-left">
            <h2 className="font-display text-2xl font-bold text-white">{t('asicMachines.products.heading')}</h2>
            <p className="text-sm text-text-subtle">{t('asicMachines.products.subheading')}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-4 sm:items-center">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('asicMachines.products.category')}</span>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category | 'All')}
                    className="w-full min-w-44 cursor-pointer appearance-none rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] py-2.5 pr-9 pl-4 text-sm text-white focus:border-accent-cyan/40 focus:outline-none"
                  >
                    <option value="All">{t('asicMachines.products.allCategories')}</option>
                    <option value="Hydro Cooling Miners">{t('asicMachines.products.categories.hydro')}</option>
                    <option value="Air Cooling Miners">{t('asicMachines.products.categories.air')}</option>
                    <option value="Immersion Miners">{t('asicMachines.products.categories.immersion')}</option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-2.5 -translate-y-1/2 text-text-subtle" />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('asicMachines.products.brand')}</span>
                <div className="relative">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as Brand | 'All')}
                    className="w-full min-w-44 cursor-pointer appearance-none rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] py-2.5 pr-9 pl-4 text-sm text-white focus:border-accent-cyan/40 focus:outline-none"
                  >
                    <option value="All">{t('asicMachines.products.allBrands')}</option>
                    {brandOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-2.5 -translate-y-1/2 text-text-subtle" />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('asicMachines.products.coin')}</span>
                <div className="relative">
                  <select
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                    className="w-full min-w-32 cursor-pointer appearance-none rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] py-2.5 pr-9 pl-4 text-sm text-white focus:border-accent-cyan/40 focus:outline-none"
                  >
                    <option value="All">{t('asicMachines.products.allCoins')}</option>
                    {coinOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-2.5 -translate-y-1/2 text-text-subtle" />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('asicMachines.products.algorithm')}</span>
                <div className="relative">
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full min-w-36 cursor-pointer appearance-none rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] py-2.5 pr-9 pl-4 text-sm text-white focus:border-accent-cyan/40 focus:outline-none"
                  >
                    <option value="All">{t('asicMachines.products.allAlgorithms')}</option>
                    {algorithmOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-2.5 -translate-y-1/2 text-text-subtle" />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('asicMachines.products.sort')}</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="w-full min-w-32 cursor-pointer appearance-none rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] py-2.5 pr-9 pl-4 text-sm text-white focus:border-accent-cyan/40 focus:outline-none"
                  >
                    <option value="None">{t('asicMachines.products.sortOptions.none')}</option>
                    <option value="Price: Low to High">{t('asicMachines.products.sortOptions.priceLow')}</option>
                    <option value="Price: High to Low">{t('asicMachines.products.sortOptions.priceHigh')}</option>
                    <option value="Hashrate: High to Low">{t('asicMachines.products.sortOptions.hashrate')}</option>
                    <option value="Power: Low to High">{t('asicMachines.products.sortOptions.power')}</option>
                    <option value="Efficiency: Best First">{t('asicMachines.products.sortOptions.efficiency')}</option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-2.5 -translate-y-1/2 text-text-subtle" />
                </div>
              </label>
            </div>

            <div className="relative w-full md:w-70">
              <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('asicMachines.products.searchPlaceholder')}
                className="w-full rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-text-faint focus:border-accent-cyan/40 focus:outline-none"
              />
            </div>
          </div>
        </Reveal>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, i) => (
              <ProductCard key={`${product.title}-${i}`} product={product} delay={(i % 3) * 90} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/3 py-16 text-center">
            <p className="text-sm font-semibold text-white">{t('asicMachines.products.noResultsTitle')}</p>
            <p className="text-xs text-text-subtle">{t('asicMachines.products.noResultsSubtitle')}</p>
          </div>
        )}
      </Container>
    </section>
  )
}
