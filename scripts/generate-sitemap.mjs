// Regenerates public/sitemap.xml from the current route list and the live
// product catalogue. Runs automatically before every build (see package.json
// "prebuild" script) so the sitemap never drifts from products.ts.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { enPaths, localizePath } from './routes.mjs'

const SITE_URL = 'https://www.qubiteinternational.com'
const rootDir = fileURLToPath(new URL('..', import.meta.url))

const urlEntries = enPaths
  .map((path) => {
    const arPath = localizePath(path)
    return (
      `  <url>\n` +
      `    <loc>${SITE_URL}${path}</loc>\n` +
      `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${path}" />\n` +
      `    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}${arPath}" />\n` +
      `  </url>\n` +
      `  <url>\n` +
      `    <loc>${SITE_URL}${arPath}</loc>\n` +
      `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${path}" />\n` +
      `    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}${arPath}" />\n` +
      `  </url>`
    )
  })
  .join('\n')

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${urlEntries}\n</urlset>\n`

writeFileSync(`${rootDir}/public/sitemap.xml`, sitemap)
console.log(`Generated sitemap.xml with ${enPaths.length * 2} URLs (${enPaths.length} pages x en/ar).`)
