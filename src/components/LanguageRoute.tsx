import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import i18next from '@/i18n'

/**
 * Layout route that makes the URL the source of truth for language: mounted
 * once per /ar-prefixed or unprefixed route branch (see App.tsx), it forces
 * i18next to match whichever branch matched. This is what makes /ar/... a
 * real, guaranteed-Arabic landing page rather than depending on the visitor's
 * stored language preference.
 */
export function LanguageRoute({ lang }: { lang: 'en' | 'ar' }) {
  useEffect(() => {
    if (i18next.language !== lang) void i18next.changeLanguage(lang)
  }, [lang])

  return <Outlet />
}
