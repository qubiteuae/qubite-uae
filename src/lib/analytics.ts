// Pushes to the same dataLayer GTM/gtag already read from (see index.html).
// Consent Mode gates what GTM/gtag actually do with these — pushing here is
// always safe regardless of consent state.
export function pushDataLayerEvent(event: string, params: Record<string, unknown> = {}) {
  const win = window as unknown as { dataLayer?: unknown[] }
  win.dataLayer = win.dataLayer ?? []
  win.dataLayer.push({ event, ...params })
}

export function trackWhatsAppClick(ctaLocation: string, language: string) {
  pushDataLayerEvent('whatsapp_quote_click', {
    page_url: window.location.href,
    cta_location: ctaLocation,
    language,
  })
}

export function trackPhoneClick(ctaLocation: string) {
  pushDataLayerEvent('phone_click', {
    page_url: window.location.href,
    cta_location: ctaLocation,
  })
}
