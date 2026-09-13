import { useTranslation } from 'react-i18next'
import { localizePath } from '@/lib/i18nPaths'

/** Returns a function that prefixes an unprefixed path with /ar when the current language is Arabic. */
export function useLocalizedPath() {
  const { i18n } = useTranslation()
  return (path: string) => localizePath(path, i18n.language)
}
