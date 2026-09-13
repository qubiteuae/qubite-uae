// Every route is addressable in both languages via a leading /ar segment
// (e.g. /hosting and /ar/hosting), so Arabic Google Ads campaigns can point
// at a guaranteed-Arabic Final URL instead of relying on client-side language
// detection. `path` is always the unprefixed, English-canonical form.
export function localizePath(path: string, lang: string): string {
  if (lang !== 'ar') return path
  return path === '/' ? '/ar' : `/ar${path}`
}

export function stripLangPrefix(pathname: string): string {
  if (pathname === '/ar') return '/'
  if (pathname.startsWith('/ar/')) return pathname.slice(3)
  return pathname
}
