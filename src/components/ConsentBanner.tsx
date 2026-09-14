import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { readStoredConsent, storeConsent, updateGtagConsent, type ConsentChoice } from '@/lib/consent'

function LockIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-accent-bronze' : 'bg-white/15'
      }`}
    >
      <span
        className={`inline-block size-3.5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  )
}

export function ConsentBanner() {
  const { t } = useTranslation()
  const toLang = useLocalizedPath()
  const [visible, setVisible] = useState(false)
  const [voluntary, setVoluntary] = useState(false)

  useEffect(() => {
    const stored = readStoredConsent()
    if (stored) {
      updateGtagConsent(stored)
      setVoluntary(stored === 'granted')
    } else {
      setVisible(true)
    }
  }, [])

  function apply(choice: ConsentChoice) {
    storeConsent(choice)
    updateGtagConsent(choice)
    setVoluntary(choice === 'granted')
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
      <div className="flex w-full max-w-[560px] flex-col gap-4 rounded-2xl border border-white/10 bg-[#0c0f0e] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-white">{t('consent.title')}</span>
          <p className="text-xs leading-relaxed text-text-dim">
            {t('consent.body')}{' '}
            <a href={toLang('/privacy-policy')} className="font-semibold text-white underline underline-offset-2">
              {t('consent.privacyPolicy')}
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                <LockIcon className="size-3 text-text-faint" />
                {t('consent.essentialTitle')}
              </span>
              <span className="text-[11px] leading-snug text-text-faint">{t('consent.essentialDescription')}</span>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wide text-text-faint uppercase">
              {t('consent.alwaysActive')}
            </span>
          </div>

          <div className="h-px w-full bg-white/8" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">{t('consent.voluntaryTitle')}</span>
              <span className="text-[11px] leading-snug text-text-faint">{t('consent.voluntaryDescription')}</span>
            </div>
            <ToggleSwitch checked={voluntary} onChange={setVoluntary} label={t('consent.voluntaryTitle')} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => apply('denied')}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-95"
          >
            {t('consent.reject')}
          </button>
          <button
            type="button"
            onClick={() => apply(voluntary ? 'granted' : 'denied')}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-95"
          >
            {t('consent.savePreferences')}
          </button>
          <button
            type="button"
            onClick={() => apply('granted')}
            className="rounded-full bg-accent-bronze px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
