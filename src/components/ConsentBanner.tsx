import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { readStoredConsent, storeConsent, updateGtagConsent, type ConsentChoice } from '@/lib/consent'

export function ConsentBanner() {
  const { t } = useTranslation()
  const toLang = useLocalizedPath()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = readStoredConsent()
    if (stored) {
      updateGtagConsent(stored)
    } else {
      setVisible(true)
    }
  }, [])

  function choose(choice: ConsentChoice) {
    storeConsent(choice)
    updateGtagConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.title')}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4"
    >
      <div className="flex w-full max-w-[720px] flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c0f0e] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-text-dim">
          {t('consent.body')}{' '}
          <a href={toLang('/privacy-policy')} className="font-semibold text-white underline underline-offset-2">
            {t('consent.privacyPolicy')}
          </a>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-95"
          >
            {t('consent.reject')}
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="rounded-full bg-accent-bronze px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
