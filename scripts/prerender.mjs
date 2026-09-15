// Runs after `vite build` (see package.json "postbuild") and turns the
// client-only SPA output into real static HTML per route.
//
// Without this, every URL on the site serves the exact same empty
// `<div id="root"></div>` shell — all content only exists after the browser
// downloads and executes the JS bundle. That's invisible to any crawler or
// review pipeline that reads the raw HTTP response without running
// JavaScript, which is a known cause of Google Ads "Destination not working"
// / "Insufficient original content" disapprovals.
//
// This script boots the built app in a real headless browser (so every
// browser API the app touches — window.location, IntersectionObserver, etc.
// — works exactly as it does for a real visitor), lets each route render and
// run its usePageSeo effect (title/meta/canonical/hreflang/JSON-LD), then
// saves the fully-rendered DOM as static HTML at that route's path. Vercel's
// static file serving takes priority over the SPA-fallback rewrite in
// vercel.json, so these files are what crawlers see, while real visitors
// still get the same interactive SPA once the JS bundle loads and re-renders.
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'
import { allPaths } from './routes.mjs'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const distDir = path.join(rootDir, 'dist')

// Block third-party analytics/ad tags during prerendering: they add no
// content to the captured HTML, slow every page load down waiting on
// real network requests, and would otherwise fire a fake pageview/conversion
// hit to GTM and Google Ads on every single build.
const BLOCKED_HOSTS = ['googletagmanager.com', 'google-analytics.com', 'googlesyndication.com', 'doubleclick.net']

function outputFileFor(routePath) {
  const relative = routePath === '/' ? 'index.html' : `${routePath.slice(1)}/index.html`
  return path.join(distDir, relative)
}

async function main() {
  const server = await preview({ root: rootDir, preview: { port: 4173, strictPort: false } })
  const address = server.resolvedUrls.local[0].replace(/\/$/, '')

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (BLOCKED_HOSTS.some((host) => url.includes(host))) return route.abort()
    return route.continue()
  })

  let count = 0
  for (const routePath of allPaths) {
    await page.goto(`${address}${routePath}`, { waitUntil: 'load' })
    await page.waitForFunction(() => document.getElementById('root')?.children.length)
    // Effects (usePageSeo, i18n language switch for /ar routes, etc.) run in
    // the frame after mount — a short settle avoids racing them.
    await page.waitForTimeout(150)

    const html = await page.content()
    const outFile = outputFileFor(routePath)
    mkdirSync(path.dirname(outFile), { recursive: true })
    writeFileSync(outFile, html)
    count += 1
  }

  await browser.close()
  await new Promise((resolve, reject) => server.httpServer.close((err) => (err ? reject(err) : resolve())))

  console.log(`Prerendered ${count} routes into dist/.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
