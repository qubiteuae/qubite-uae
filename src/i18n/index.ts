import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ar } from './locales/ar'
import { en } from './locales/en'

export const RTL_LANGUAGES = new Set(['ar'])

// The URL is authoritative for language (see LanguageRoute / App.tsx): every
// route exists in both an unprefixed English form and an /ar-prefixed Arabic
// form. Deciding the initial language from the URL — rather than only from
// localStorage — matters because i18next initializes before React Router
// resolves the route; without this, a first-time visitor landing on any
// /ar/... URL (e.g. from an Arabic Google Ads click) would render one frame
// of English before LanguageRoute's effect corrects it.
const { pathname } = window.location
const initialLanguage = pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en'

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

function applyDocumentDirection(language: string) {
  document.documentElement.lang = language
  document.documentElement.dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
}

applyDocumentDirection(initialLanguage)

i18next.on('languageChanged', (language) => {
  localStorage.setItem('qubite-language', language)
  applyDocumentDirection(language)
})

export default i18next
