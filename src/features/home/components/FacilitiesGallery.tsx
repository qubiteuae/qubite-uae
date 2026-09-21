import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

const photos = [
  '/facilities/site-1.webp',
  '/facilities/site-2.webp',
  '/facilities/site-3.webp',
  '/facilities/site-5.webp',
  '/facilities/site-6.webp',
  '/facilities/site-7.webp',
  '/facilities/site-8.webp',
  '/facilities/site-9.webp',
  '/facilities/site-10.webp',
  '/facilities/site-11.webp',
  '/facilities/site-12.webp',
  // repeated to complete the 4x3 grid — swap for a 12th real photo when available
  '/facilities/site-1.webp',
]

export function FacilitiesGallery() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(120,66,20,0.5) 0%, rgba(120,66,20,0.18) 30%, transparent 55%), ' +
            'linear-gradient(225deg, rgba(13,90,80,0.5) 0%, rgba(13,90,80,0.18) 30%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-transparent to-black"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center gap-4 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(45,212,191,0.3)] bg-[rgba(20,60,55,0.4)] px-4 py-1.5 text-[10px] font-bold tracking-[0.08em] text-[#2dd4bf] uppercase">
            <span className="size-1.5 rounded-full bg-[#2dd4bf]" />
            {t('home.facilitiesGallery.badge')}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[28px] font-bold text-white sm:text-[34px]">{t('home.facilitiesGallery.heading')}</h2>
        </Reveal>

        <Reveal delay={160} className="mt-10 w-full">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {photos.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group aspect-[4/3] overflow-hidden rounded-2xl border border-white/8 transition-all duration-300 hover:border-white/20"
              >
                <img
                  src={src}
                  alt={`${t('home.facilitiesGallery.photoAlt')} ${i + 1}`}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
