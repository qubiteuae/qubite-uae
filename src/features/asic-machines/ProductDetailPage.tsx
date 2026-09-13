import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { getProductBySlug } from '@/features/asic-machines/products'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { SITE_URL, usePageSeo } from '@/hooks/usePageSeo'
import { localizePath } from '@/lib/i18nPaths'
import { EfficiencyIcon, HashrateIcon, PowerIcon, WhatsAppIcon } from './components/icons'

function HeadsetIcon({ className = 'size-4' }: { className?: string }) {
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

function ChevronRightIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 12" className={className} fill="none" aria-hidden="true">
      <path d="M1.5 1 6.5 6l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const hostingTierRates = [0.065, 0.075, 0.08]
const hostingTierRecommended = [false, true, false]

const currencyPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export function ProductDetailPage() {
  const { t, i18n } = useTranslation()
  const toLang = useLocalizedPath()
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined
  const productPath = `/asic-machines/${slug ?? ''}`
  const actualProductUrl = `${SITE_URL}${localizePath(productPath, i18n.language)}`
  usePageSeo(
    product
      ? {
          title: product.seoTitle ?? `${product.title} | Qubite International`,
          description: product.metaDescription ?? product.description,
          path: productPath,
          image: product.media.type === 'image' ? product.media.src : undefined,
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              brand: { '@type': 'Brand', name: product.brand },
              description: product.metaDescription ?? product.description,
              ...(product.media.type === 'image' ? { image: `${SITE_URL}${product.media.src}` } : {}),
              url: actualProductUrl,
              ...(product.priceUsd
                ? {
                    offers: {
                      '@type': 'Offer',
                      priceCurrency: 'USD',
                      price: product.priceUsd,
                      availability: 'https://schema.org/InStock',
                    },
                  }
                : {}),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}${toLang('/')}` },
                { '@type': 'ListItem', position: 2, name: 'Machines', item: `${SITE_URL}${toLang('/asic-machines')}` },
                { '@type': 'ListItem', position: 3, name: product.title, item: actualProductUrl },
              ],
            },
          ],
        }
      : {
          title: t('seo.productNotFound.title'),
          description: t('seo.productNotFound.description'),
          path: productPath,
          noindex: true,
        },
  )

  // Reuses the same 3 tiers (skipping Turnkey Site) from the hosting plans
  // translations so tier names/taglines stay in sync with the /hosting page.
  const hostingTiers = (
    t('hosting.pricingPlans.plans', { returnObjects: true }) as { name: string; tagline: string }[]
  )
    .slice(1)
    .map((plan, i) => ({ ...plan, rate: hostingTierRates[i], recommended: hostingTierRecommended[i] }))

  const [hostingRateIndex, setHostingRateIndex] = useState(
    hostingTiers.findIndex((tier) => tier.recommended) === -1 ? 0 : hostingTiers.findIndex((tier) => tier.recommended),
  )

  if (!product) {
    return (
      <section className="bg-bg py-32">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold text-white">{t('productDetail.notFoundTitle')}</h1>
          <p className="text-sm text-text-subtle">{t('productDetail.notFoundBody')}</p>
          <Link
            to={toLang('/asic-machines')}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent-bronze px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:brightness-110"
          >
            {t('productDetail.backToMachines')}
          </Link>
        </Container>
      </section>
    )
  }

  const inStock = product.status === 'In Stock'
  const productWhatsAppLink =
    'https://wa.me/971556615745?text=' +
    encodeURIComponent(
      `Hello Qubite, I'm interested in the ${product.title} (${product.hashrate}). Could you share current pricing and hosting options? ${actualProductUrl}`,
    )

  return (
    <div className="bg-bg pt-24">
      <Container className="pt-8">
        <nav className="flex items-center gap-2 text-xs text-text-faint">
          <Link to={toLang('/')} className="transition-colors hover:text-white">
            {t('productDetail.breadcrumbHome')}
          </Link>
          <ChevronRightIcon className="size-2.5" />
          <Link to={toLang('/asic-machines')} className="transition-colors hover:text-white">
            {t('productDetail.breadcrumbMachines')}
          </Link>
          <ChevronRightIcon className="size-2.5" />
          <span className="text-text-dim">{product.title}</span>
        </nav>
      </Container>

      {/* header */}
      <section className="py-8">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div
              className="relative aspect-square overflow-hidden rounded-[28px] border border-white/8"
              style={{ background: 'radial-gradient(ellipse at center, #0d2b2e 0%, #0a1512 60%, #0a0a0a 100%)' }}
            >
              {product.media.type === 'image' ? (
                <img src={product.media.src} alt={product.title} className="absolute inset-0 size-full object-cover" />
              ) : (
                <video
                  src={product.media.src}
                  className="absolute inset-0 size-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </div>
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-5">
            <Badge tone="bronze">
              {t('productDetail.hostingStartsFrom')} {(hostingTiers[0].rate * 100).toFixed(1)}
              {t('productDetail.perKwh')}
            </Badge>
            <h1 className="text-[28px] leading-tight font-black text-white sm:text-[36px]">{product.title}</h1>

            <div className="flex flex-wrap items-center gap-4">
              <span
                className={
                  product.priceUsd === null
                    ? 'text-lg font-bold text-[#e8a765]'
                    : 'text-[34px] font-black tabular-nums text-[#e8a765]'
                }
              >
                {product.price}
              </span>
              {product.status ? (
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${
                    inStock
                      ? 'border-[rgba(74,222,128,0.3)] bg-[rgba(34,197,94,0.12)] text-[#4ade80]'
                      : 'border-[rgba(248,113,113,0.3)] bg-[rgba(239,68,68,0.12)] text-[#f87171]'
                  }`}
                >
                  {inStock ? t('asicMachines.products.inStock') : t('asicMachines.products.noStock')}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-dim">
              <span className="flex items-center gap-1.5">
                <HashrateIcon className="size-4 text-[#22d3ee]" />
                {t('productDetail.hashrate')}: <span className="font-semibold text-white">{product.hashrate}</span>
              </span>
              <span className="text-text-faint">·</span>
              <span className="flex items-center gap-1.5">
                <PowerIcon className="size-4 text-[#4ade80]" />
                {t('productDetail.power')}: <span className="font-semibold text-white">{product.power}</span>
              </span>
              <span className="text-text-faint">·</span>
              <span className="flex items-center gap-1.5">
                <EfficiencyIcon className="size-4 text-[#facc15]" />
                {t('productDetail.efficiency')}: <span className="font-semibold text-white">{product.efficiency}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={productWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#22c55e] to-[#16a34a] px-6 py-3 text-sm font-bold text-white uppercase transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ boxShadow: '0 4px 14px rgba(34,197,94,0.3)' }}
              >
                <WhatsAppIcon className="size-4" />
                {t('productDetail.requestPrice')}
              </a>
              <a
                href={productWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-95"
              >
                <HeadsetIcon />
                {t('productDetail.talkToAHuman')}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* hosting plans */}
      <section className="py-12">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white">{t('productDetail.hostingPlans.title')}</h2>
              <p className="text-sm text-text-subtle">
                {t('productDetail.hostingPlans.subtitle')} {product.power} {t('productDetail.hostingPlans.subtitleSuffix')}
              </p>
            </div>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {hostingTiers.map((tier, i) => {
              const monthlyCost = (product.powerValue * 24 * 30 * tier.rate) / 1000
              const selected = hostingRateIndex === i
              return (
                <Reveal key={tier.name} delay={i * 80} className="h-full">
                  <button
                    type="button"
                    onClick={() => setHostingRateIndex(i)}
                    className={`relative flex h-full w-full flex-col gap-4 rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                      selected
                        ? 'border-[rgba(232,167,101,0.5)] bg-[rgba(232,167,101,0.06)]'
                        : 'border-white/8 bg-white/3 hover:border-white/20'
                    }`}
                  >
                    {tier.recommended ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-bronze px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                        {t('productDetail.hostingPlans.recommended')}
                      </span>
                    ) : null}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-white">{tier.name}</h3>
                      <p className="text-xs text-text-dim">{tier.tagline}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#e8a765]">{(tier.rate * 100).toFixed(1)}¢</span>
                      <span className="text-xs text-text-faint">{t('productDetail.hostingPlans.perKwh')}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-t border-white/8 pt-3">
                      <span className="text-[10px] tracking-wide text-text-faint uppercase">{t('productDetail.hostingPlans.estMonthlyCost')}</span>
                      <span className="text-lg font-bold text-white">{currencyPrecise.format(monthlyCost)}</span>
                    </div>
                    {selected ? (
                      <span className="text-[10px] font-bold tracking-wide text-[#e8a765] uppercase">{t('productDetail.hostingPlans.selected')}</span>
                    ) : null}
                  </button>
                </Reveal>
              )
            })}
          </div>
          <Reveal delay={240}>
            <Link
              to={toLang('/hosting')}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bronze-tint transition-colors hover:text-white"
            >
              {t('productDetail.hostingPlans.viewAllPlans')}
              <ChevronRightIcon className="size-3" />
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* description + specs */}
      <section className="py-12 pb-24">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-white">{t('productDetail.description')}</h2>
              <p className="text-sm leading-relaxed text-text-dim">{product.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.mineableCoins.map((coin) => (
                  <span
                    key={coin.ticker}
                    className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {coin.name} ({coin.ticker})
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-white">{t('productDetail.technicalSpecifications')}</h2>
              <div className="overflow-hidden rounded-2xl border border-white/8">
                {[
                  [t('productDetail.specs.manufacturer'), product.specs.manufacturer],
                  [t('productDetail.specs.model'), product.specs.model],
                  [t('productDetail.specs.algorithm'), product.algorithm],
                  [t('productDetail.specs.release'), product.specs.release],
                  [t('productDetail.specs.dimensions'), product.dimensionsMm ? `${product.dimensionsMm} mm` : null],
                  [t('productDetail.specs.weight'), product.weightKg ? `${product.weightKg} kg` : null],
                  [t('productDetail.specs.noiseLevel'), product.specs.noiseLevel],
                  [t('productDetail.specs.fans'), product.specs.fans],
                  [t('productDetail.specs.interface'), product.specs.interface],
                  [t('productDetail.specs.inputVoltage'), product.specs.inputVoltage],
                  [t('productDetail.specs.temperature'), product.specs.temperature],
                  [t('productDetail.specs.humidity'), product.specs.humidity],
                  [
                    t('productDetail.specs.psuIncluded'),
                    product.psuIncluded === null || product.psuIncluded === undefined
                      ? null
                      : product.psuIncluded
                        ? t('productDetail.specs.yes')
                        : t('productDetail.specs.no'),
                  ],
                ]
                  .filter((row): row is [string, string] => row[1] !== null)
                  .map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-white/3' : 'bg-transparent'}`}
                  >
                    <span className="text-text-faint">{label}</span>
                    <span className="font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
