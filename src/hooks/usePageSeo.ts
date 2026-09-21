import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/lib/i18nPaths'

const SITE_URL = 'https://www.qubiteinternational.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/figma/hero/logo.webp`

interface PageSeoOptions {
  title: string
  description: string
  /** Unprefixed, English-canonical site-relative path, e.g. "/hosting". The hook adds /ar automatically for the Arabic route. */
  path: string
  /** Absolute or site-relative image URL for og:image / twitter:image. */
  image?: string
  /** Set true for soft-404 / not-found states so they're excluded from indexing. */
  noindex?: boolean
  /** Raw JSON-LD object(s) to inject as <script type="application/ld+json">. */
  jsonLd?: object | object[]
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

function upsertHreflang(hreflang: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function removeHreflang(hreflang: string) {
  document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)?.remove()
}

/**
 * Sets per-route title, meta description, canonical, hreflang, robots, and
 * Open Graph / Twitter tags while the page is mounted, restoring the previous
 * document head state on unmount. Every routed page should call this once.
 * `path` is always the unprefixed English path — this hook resolves the
 * actual canonical URL (with /ar when applicable) from the current language.
 */
export function usePageSeo({ title, description, path, image, noindex, jsonLd }: PageSeoOptions) {
  const { i18n } = useTranslation()

  useEffect(() => {
    const actualPath = localizePath(path, i18n.language)
    const url = `${SITE_URL}${actualPath}`
    const resolvedImage = image
      ? image.startsWith('http')
        ? image
        : `${SITE_URL}${image}`
      : DEFAULT_OG_IMAGE

    const previousTitle = document.title
    const descriptionEl = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = descriptionEl?.getAttribute('content') ?? null

    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const previousCanonical = canonicalEl?.getAttribute('href') ?? null
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }

    document.title = title
    if (descriptionEl) descriptionEl.setAttribute('content', description)
    canonicalEl.setAttribute('href', url)

    upsertHreflang('en', `${SITE_URL}${path}`)
    upsertHreflang('ar', `${SITE_URL}${localizePath(path, 'ar')}`)
    upsertHreflang('x-default', `${SITE_URL}${path}`)

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow')
    } else {
      removeMeta('name', 'robots')
    }

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', resolvedImage)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', resolvedImage)

    const scripts: HTMLScriptElement[] = []
    if (jsonLd) {
      for (const entry of Array.isArray(jsonLd) ? jsonLd : [jsonLd]) {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(entry)
        document.head.appendChild(script)
        scripts.push(script)
      }
    }

    return () => {
      document.title = previousTitle
      if (descriptionEl && previousDescription !== null) descriptionEl.setAttribute('content', previousDescription)
      if (previousCanonical !== null) canonicalEl.setAttribute('href', previousCanonical)
      removeHreflang('en')
      removeHreflang('ar')
      removeHreflang('x-default')
      removeMeta('name', 'robots')
      removeMeta('property', 'og:type')
      removeMeta('property', 'og:title')
      removeMeta('property', 'og:description')
      removeMeta('property', 'og:url')
      removeMeta('property', 'og:image')
      removeMeta('name', 'twitter:card')
      removeMeta('name', 'twitter:title')
      removeMeta('name', 'twitter:description')
      removeMeta('name', 'twitter:image')
      for (const script of scripts) script.remove()
    }
  }, [title, description, path, image, noindex, jsonLd, i18n.language])
}

export { SITE_URL }
