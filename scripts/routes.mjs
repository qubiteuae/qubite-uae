// Shared route list for the sitemap generator and the prerender script, so
// both always agree on exactly which pages exist. Derives ASIC product paths
// straight from products.ts (skipping any needsReview drafts) instead of
// hardcoding them, so a catalog change can't silently desync the two scripts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

const corePaths = ['/', '/asic-machines', '/hosting', '/about', '/privacy-policy', '/terms']

const productsSource = readFileSync(`${rootDir}/src/features/asic-machines/products.ts`, 'utf8')
const slugMatches = [...productsSource.matchAll(/slug: '([^']+)'/g)]

const productPaths = slugMatches
  .map((match, i) => {
    const start = match.index
    const end = slugMatches[i + 1]?.index ?? productsSource.length
    const block = productsSource.slice(start, end)
    const needsReview = /needsReview:\s*true/.test(block)
    return needsReview ? null : `/asic-machines/${match[1]}`
  })
  .filter((path) => path !== null)

export const enPaths = [...corePaths, ...productPaths]

export function localizePath(path) {
  return path === '/' ? '/ar' : `/ar${path}`
}

export const arPaths = enPaths.map(localizePath)

export const allPaths = [...enPaths, ...arPaths]
