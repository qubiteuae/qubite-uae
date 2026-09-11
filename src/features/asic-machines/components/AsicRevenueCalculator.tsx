import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { baseProducts } from '@/features/asic-machines/products'
import { calcBreakevenPrice, calcBtcMinedPerMonth, calcMonthlyHostingCost } from '@/features/asic-machines/revenueMath'
import { HashrateIcon } from './icons'

const MAX_BTC_PRICE = 300_000
const btcPricePresets = [80_000, 100_000, 150_000, 200_000]

const hostingTierRates = [0.065, 0.075, 0.08]
const hostingTierRecommended = [false, true, false]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const currencyPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

function CoinIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M8 1.5 14.5 5.5V10.5L8 14.5L1.5 10.5V5.5L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path
        d="M8 5V11M6.3 6.3H9C9.55 6.3 10 6.75 10 7.3C10 7.85 9.55 8.3 9 8.3H6.3M6.3 8.3H9.2C9.75 8.3 10.2 8.75 10.2 9.3C10.2 9.85 9.75 10.3 9.2 10.3H6.3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BoltIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M9 1.5 3 9h4l-1 5.5 6-7.5H8l1-5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function TrendUpIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M2 12 6 7l3 2.5L14 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 3h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AsicRevenueCalculator() {
  const { t } = useTranslation()

  const hostingTiers = (
    t('hosting.pricingPlans.plans', { returnObjects: true }) as { name: string; tagline: string }[]
  )
    .slice(1)
    .map((plan, i) => ({ ...plan, rate: hostingTierRates[i], recommended: hostingTierRecommended[i] }))

  const [productIndex, setProductIndex] = useState(0)
  const [hostingRateIndex, setHostingRateIndex] = useState(
    hostingTiers.findIndex((tier) => tier.recommended) === -1 ? 0 : hostingTiers.findIndex((tier) => tier.recommended),
  )
  const product = baseProducts[productIndex]

  // The slider's floor is pinned above this machine+tier's actual breakeven
  // BTC price (with a 15% safety margin), so no combination the user can
  // reach on the slider ever produces a loss — the range itself guarantees
  // profitability rather than clamping/faking the displayed numbers.
  const minBtcPrice = useMemo(() => {
    const breakeven = calcBreakevenPrice(product, hostingTiers, hostingTiers[hostingRateIndex].rate)
    return Math.max(20_000, Math.ceil((breakeven * 1.15) / 1000) * 1000)
  }, [product, hostingRateIndex, hostingTiers])

  const [btcPrice, setBtcPrice] = useState(() => Math.max(80_000, minBtcPrice))

  useEffect(() => {
    setBtcPrice((prev) => Math.min(MAX_BTC_PRICE, Math.max(minBtcPrice, prev)))
  }, [minBtcPrice])

  const revenue = useMemo(() => {
    const btcMinedPerMonth = calcBtcMinedPerMonth(product, hostingTiers)
    const monthly = btcMinedPerMonth * btcPrice
    const monthlyHostingCost = calcMonthlyHostingCost(product, hostingTiers[hostingRateIndex].rate)
    return { btcMinedPerMonth, monthly, monthlyHostingCost, netMonthly: monthly - monthlyHostingCost }
  }, [product, btcPrice, hostingRateIndex, hostingTiers])

  const availablePresets = btcPricePresets.filter((preset) => preset >= minBtcPrice)
  const sliderPercent = ((btcPrice - minBtcPrice) / (MAX_BTC_PRICE - minBtcPrice)) * 100

  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(232,167,101,0.16), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-4 text-center">
        <Reveal>
          <Badge tone="bronze">{t('asicMachines.calculator.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[28px] font-bold text-white sm:text-[34px]">{t('asicMachines.calculator.heading')}</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[560px] text-sm text-text-dim">{t('asicMachines.calculator.subtitle')}</p>
        </Reveal>

        <Reveal delay={200} className="mt-10 w-full max-w-[1000px]">
          <div className="flex flex-col gap-3 text-left">
            <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">
              {t('asicMachines.calculator.selectMachine')}
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {baseProducts.map((p, i) => {
                const selected = productIndex === i
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setProductIndex(i)}
                    className={`group relative flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                      selected
                        ? 'border-[rgba(232,167,101,0.55)] bg-[rgba(232,167,101,0.08)] shadow-[0_0_36px_-12px_rgba(232,167,101,0.6)]'
                        : 'border-white/8 bg-white/3 hover:border-white/20'
                    }`}
                  >
                    {selected ? (
                      <span className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-accent-bronze text-white">
                        <CheckIcon />
                      </span>
                    ) : null}
                    <span
                      className={`flex size-10 items-center justify-center rounded-xl border transition-colors duration-300 ${
                        selected
                          ? 'border-[rgba(232,167,101,0.5)] bg-[rgba(232,167,101,0.12)] text-[#e8a765]'
                          : 'border-white/10 bg-white/5 text-text-subtle group-hover:text-white'
                      }`}
                    >
                      <HashrateIcon className="size-4" />
                    </span>
                    <span className="text-sm leading-snug font-bold text-white">{p.title}</span>
                    <span className="text-xs text-text-dim">
                      {p.hashrate} · {p.efficiency}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={260} className="mt-6 w-full max-w-[1000px]">
          <div
            className="relative overflow-hidden rounded-[28px] border border-[rgba(232,167,101,0.3)] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8"
            style={{ boxShadow: 'inset 0 0 60px rgba(232,167,101,0.06), 0 30px 60px -30px rgba(0,0,0,0.6)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text-subtle">
                <BoltIcon className="size-3.5 text-[#4ade80]" />
                {t('asicMachines.calculator.hosting')}:{' '}
                <span className="font-semibold text-white">{(hostingTiers[hostingRateIndex].rate * 100).toFixed(1)}¢/kWh</span>
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-text-faint uppercase">
                  <CoinIcon className="size-4 text-[#e8a765]" />
                  {t('productDetail.revenueCalculator.btcPrice')}
                </span>
                <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-3.5 py-2">
                  <span className="text-sm text-text-faint">$</span>
                  <input
                    type="number"
                    min={minBtcPrice}
                    max={MAX_BTC_PRICE}
                    step={1000}
                    value={btcPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (!Number.isNaN(value)) setBtcPrice(Math.min(MAX_BTC_PRICE, Math.max(minBtcPrice, value)))
                    }}
                    className="w-24 bg-transparent text-right text-base font-bold tabular-nums text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute inset-x-0 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-bronze-tint to-accent-copper transition-all duration-150"
                    style={{ width: `${sliderPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={minBtcPrice}
                  max={MAX_BTC_PRICE}
                  step={1000}
                  value={btcPrice}
                  onChange={(e) => setBtcPrice(Number(e.target.value))}
                  className="relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent accent-[#e8a765]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {availablePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBtcPrice(preset)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      btcPrice === preset
                        ? 'border-[rgba(232,167,101,0.5)] bg-[rgba(232,167,101,0.14)] text-[#e8a765]'
                        : 'border-white/10 text-text-dim hover:border-white/25 hover:text-white'
                    }`}
                  >
                    ${(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {hostingTiers.map((tier, i) => {
                const selected = hostingRateIndex === i
                return (
                  <button
                    key={tier.name}
                    type="button"
                    onClick={() => setHostingRateIndex(i)}
                    className={`flex items-center justify-between gap-2 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                      selected
                        ? 'border-[rgba(232,167,101,0.5)] bg-[rgba(232,167,101,0.08)]'
                        : 'border-white/8 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className="text-xs font-bold text-white">{tier.name}</span>
                      <span className="text-[11px] text-text-faint">{(tier.rate * 100).toFixed(1)}¢/kWh</span>
                    </span>
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        selected ? 'border-[#e8a765] bg-[#e8a765]' : 'border-white/25'
                      }`}
                    >
                      {selected ? <CheckIcon className="size-2.5 text-black" /> : null}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div
                className="relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-[rgba(232,167,101,0.5)] bg-gradient-to-b from-[rgba(232,167,101,0.14)] to-[rgba(232,167,101,0.03)] px-6 py-7 text-center"
                style={{ boxShadow: '0 0 50px -18px rgba(232,167,101,0.65)' }}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#e8a765] uppercase">
                  <TrendUpIcon className="size-4" />
                  {t('productDetail.revenueCalculator.netMonthlyProfit')}
                </span>
                <span className="text-5xl font-black text-white tabular-nums sm:text-6xl">
                  {currency.format(revenue.netMonthly)}
                </span>
                <span className="text-xs text-text-dim">/ month</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-5 py-4">
                  <span className="text-[11px] font-bold tracking-wide text-text-faint uppercase">
                    {t('productDetail.revenueCalculator.monthlyRevenue')}
                  </span>
                  <span className="text-lg font-black text-[#4ade80] tabular-nums">{currency.format(revenue.monthly)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-5 py-4">
                  <span className="text-[11px] font-bold tracking-wide text-text-faint uppercase">
                    {t('productDetail.revenueCalculator.estHostingCost')}
                  </span>
                  <span className="text-lg font-black text-[#f87171] tabular-nums">
                    -{currencyPrecise.format(revenue.monthlyHostingCost)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-left text-[11px] text-text-faint">{t('productDetail.revenueCalculator.disclaimer')}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
