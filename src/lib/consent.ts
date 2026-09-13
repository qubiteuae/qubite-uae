const STORAGE_KEY = 'qubite-consent'
export type ConsentChoice = 'granted' | 'denied'

export function readStoredConsent(): ConsentChoice | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'granted' || stored === 'denied' ? stored : null
}

export function storeConsent(choice: ConsentChoice) {
  localStorage.setItem(STORAGE_KEY, choice)
}

export function updateGtagConsent(choice: ConsentChoice) {
  const win = window as unknown as { gtag?: (...args: unknown[]) => void }
  win.gtag?.('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
}

export function resetConsentChoice() {
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}
