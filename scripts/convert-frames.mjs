import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SRC  = 'src/assets/frames'
const DEST = 'public/frames'
const W    = 1280
const Q    = 80

const chapters = fs.readdirSync(SRC).filter(d =>
  fs.statSync(path.join(SRC, d)).isDirectory()
)

for (const chapter of chapters) {
  const srcDir  = path.join(SRC, chapter)
  const destDir = path.join(DEST, chapter)
  fs.mkdirSync(destDir, { recursive: true })

  const files = fs.readdirSync(srcDir)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .sort()

  console.log(`\n${chapter}: ${files.length} frames → converting...`)

  for (let i = 0; i < files.length; i++) {
    const src  = path.join(srcDir, files[i])
    const base = files[i].replace(/\.(png|jpg|jpeg)$/i, '')
    const dest = path.join(destDir, `${base}.webp`)

    await sharp(src)
      .resize(W, null, { withoutEnlargement: true })
      .webp({ quality: Q })
      .toFile(dest)

    process.stdout.write(`\r  ${i + 1}/${files.length}`)
  }
  console.log(' ✓')
}

console.log('\nDone.')
