// One-off batch pass: resizes and re-encodes oversized PNG/JPG assets to WebP.
// Run manually (`node scripts/optimize-images.mjs`) after adding new large
// images to public/ — not wired into the build, since it's a source-asset
// transform, not something that should re-run on every deploy.
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const publicDir = path.join(rootDir, 'public')

// [glob-ish folder, maxDimension, quality] — maxDimension is the longest
// side in px; everything here is displayed well under 1000px (grid
// thumbnails, avatars, cards) except the full-bleed hero/background shots.
const targets = [
  { dir: 'facilities', max: 1000, quality: 78 },
  { dir: 'team', max: 800, quality: 80 },
  { dir: 'figma/cards', max: 1000, quality: 82 },
  { dir: 'figma/bento', max: 1000, quality: 82 },
  { dir: 'figma/resilience', max: 1000, quality: 82 },
  { dir: 'figma/deploy', max: 1000, quality: 82 },
  { dir: 'figma/hero', max: 1920, quality: 82, only: ['hero-bg.png'] },
  { dir: 'figma/hero', max: 600, quality: 82, only: ['avatar-1.png', 'avatar-2.png', 'avatar-3.png'] },
  { dir: 'figma/global', max: 1920, quality: 82, only: ['network-bg.png'] },
  { dir: 'asic/media', max: 1200, quality: 80, only: ['photo.png'] },
  { dir: '', max: 1920, quality: 82, only: ['hero-bg.png'] },
]

const SIZE_THRESHOLD = 100 * 1024 // skip anything already small

let totalBefore = 0
let totalAfter = 0
let converted = 0

for (const { dir, max, quality, only } of targets) {
  const absDir = path.join(publicDir, dir)
  let entries
  try {
    entries = readdirSync(absDir)
  } catch {
    continue
  }

  for (const name of entries) {
    if (only && !only.includes(name)) continue
    if (!/\.(png|jpe?g)$/i.test(name)) continue

    const inputPath = path.join(absDir, name)
    const stat = statSync(inputPath)
    if (stat.size < SIZE_THRESHOLD) continue

    const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, '.webp')
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    const needsResize = Math.max(metadata.width ?? 0, metadata.height ?? 0) > max

    await image
      .resize(needsResize ? { width: max, height: max, fit: 'inside', withoutEnlargement: true } : undefined)
      .webp({ quality })
      .toFile(outputPath)

    const afterSize = statSync(outputPath).size
    totalBefore += stat.size
    totalAfter += afterSize
    converted += 1

    try {
      unlinkSync(inputPath)
    } catch (err) {
      console.warn(`  (couldn't delete original ${path.join(dir, name)}: ${err.code} — delete it manually)`)
    }

    console.log(
      `${path.join(dir, name)} -> ${path.join(dir, name.replace(/\.(png|jpe?g)$/i, '.webp'))}  ` +
        `${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(afterSize / 1024 / 1024).toFixed(2)}MB`,
    )
  }
}

console.log(
  `\nConverted ${converted} files. Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB ` +
    `(saved ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`,
)
