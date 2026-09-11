export type Category = 'Air Cooling Miners' | 'Hydro Cooling Miners' | 'Immersion Miners'
export type Brand = 'MicroBT' | 'Bitmain'

export interface Product {
  slug: string
  title: string
  tag: string
  price: string
  priceUsd: number
  status: 'In Stock' | 'No Stock'
  hashrate: string
  hashrateValue: number
  power: string
  powerValue: number
  efficiency: string
  dailyProfit: string
  dailyProfitUsd: number
  payback: string
  media: { type: 'image' | 'video'; src: string }
  category: Category
  brand: Brand
  algorithm: string
  mineableCoins: { name: string; ticker: string }[]
  description: string
  specs: {
    manufacturer: string
    model: string
    release: string
    noiseLevel: string
    fans: string
    interface: string
    temperature: string
    humidity: string
  }
}

export const baseProducts: Product[] = [
  {
    slug: 'microbt-whatsminer-m66s-plus-318th',
    title: 'MicroBT WhatsMiner M66S+ (318TH)',
    tag: 'AIR',
    price: '$817',
    priceUsd: 817,
    status: 'In Stock',
    hashrate: '318 TH/s',
    hashrateValue: 318,
    power: '5,883 W',
    powerValue: 5883,
    efficiency: '18.5 J/TH',
    dailyProfit: '+$3.92',
    dailyProfitUsd: 3.92,
    payback: '954d',
    media: { type: 'image', src: '/asic/media/photo.png' },
    category: 'Air Cooling Miners',
    brand: 'MicroBT',
    algorithm: 'SHA-256',
    mineableCoins: [
      { name: 'Bitcoin', ticker: 'BTC' },
      { name: 'Bitcoin Cash', ticker: 'BCH' },
    ],
    description:
      'The MicroBT WhatsMiner M66S+ (318TH) is a high-performance ASIC miner designed for the SHA-256 algorithm. It delivers a hashrate of 318 TH/s with a power consumption of 5,883 W, offering an efficiency of 18.5 J/TH.',
    specs: {
      manufacturer: 'MicroBT',
      model: 'MicroBT WhatsMiner M66S+ (318TH)',
      release: 'Latest Batch',
      noiseLevel: '75db',
      fans: '4',
      interface: 'Ethernet',
      temperature: '5 - 45 °C',
      humidity: '5 - 95 %',
    },
  },
  {
    slug: 'bitmain-antminer-s21-xp-270th',
    title: 'Bitmain Antminer S21 XP (270TH)',
    tag: 'BITMAIN',
    price: '$6,800',
    priceUsd: 6800,
    status: 'No Stock',
    hashrate: '270 TH/s',
    hashrateValue: 270,
    power: '3,645 W',
    powerValue: 3645,
    efficiency: '13.5 J/TH',
    dailyProfit: '+$8.10',
    dailyProfitUsd: 8.1,
    payback: '839d',
    media: { type: 'video', src: '/asic/media/video-1.webm' },
    category: 'Hydro Cooling Miners',
    brand: 'Bitmain',
    algorithm: 'SHA-256',
    mineableCoins: [
      { name: 'Bitcoin', ticker: 'BTC' },
      { name: 'Bitcoin Cash', ticker: 'BCH' },
      { name: 'Bitcoin SV', ticker: 'BSV' },
    ],
    description:
      'The Bitmain Antminer S21 XP (270TH) is a high-performance ASIC miner designed for the SHA-256 algorithm. It delivers a hashrate of 270 TH/s with a power consumption of 3,645 W, offering an efficiency of 13.5 J/TH.',
    specs: {
      manufacturer: 'Bitmain',
      model: 'Bitmain Antminer S21 XP (270TH)',
      release: 'Jan 2026',
      noiseLevel: '75db',
      fans: '4',
      interface: 'Ethernet',
      temperature: '5 - 45 °C',
      humidity: '5 - 95 %',
    },
  },
  {
    slug: 'bitmain-antminer-s21-pro-plus-234th',
    title: 'Bitmain Antminer S21 Pro+ (234TH)',
    tag: 'FAN',
    price: '$8,900',
    priceUsd: 8900,
    status: 'In Stock',
    hashrate: '234 TH/s',
    hashrateValue: 234,
    power: '3,510 W',
    powerValue: 3510,
    efficiency: '15.0 J/TH',
    dailyProfit: '+$11.20',
    dailyProfitUsd: 11.2,
    payback: '795d',
    media: { type: 'video', src: '/asic/media/video-2.webm' },
    category: 'Immersion Miners',
    brand: 'Bitmain',
    algorithm: 'SHA-256',
    mineableCoins: [
      { name: 'Bitcoin', ticker: 'BTC' },
      { name: 'Bitcoin Cash', ticker: 'BCH' },
      { name: 'Bitcoin SV', ticker: 'BSV' },
    ],
    description:
      'The Bitmain Antminer S21 Pro+ (234TH) is a high-performance ASIC miner designed for the SHA-256 algorithm. It delivers a hashrate of 234 TH/s with a power consumption of 3,510 W, offering an efficiency of 15.0 J/TH.',
    specs: {
      manufacturer: 'Bitmain',
      model: 'Bitmain Antminer S21 Pro+ (234TH)',
      release: 'Latest Batch',
      noiseLevel: '76db',
      fans: '4',
      interface: 'Ethernet',
      temperature: '5 - 45 °C',
      humidity: '5 - 95 %',
    },
  },
]

export const products: Product[] = baseProducts

export function getProductBySlug(slug: string): Product | undefined {
  return baseProducts.find((product) => product.slug === slug)
}
