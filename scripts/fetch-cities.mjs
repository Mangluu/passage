// Destination hero photos — genuine, openly-licensed landmark photography from
// Wikimedia Commons (run: `node scripts/fetch-cities.mjs`).
//
// Keyless and reproducible: for each curated country it resolves a specific
// Commons file to a width-capped thumbnail (never the multi-hundred-MB original),
// crops it to the 16:9 hero, and writes src/assets/cities/<code>/1.jpg plus the
// attribution into src/data/cityPhotos.json. Every photo is credited in-app and
// links back to its Commons page — same "name your source" rule as every claim.

import sharp from 'sharp'
import { writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'src', 'assets', 'cities')
const DATA = join(HERE, '..', 'src', 'data', 'cityPhotos.json')
const UA = 'LibertyCompass/1.0 (personal project; github.com/Mangluu/passage)'
const WIDTH = 1400
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// One hand-picked, openly-licensed Commons photo per curated country.
const PHOTOS = {
  us: { city: 'New York', file: 'Lower Manhattan from Jersey City November 2014 panorama 2.jpg', author: 'King of Hearts', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0' },
  br: { city: 'Rio de Janeiro', file: 'Sugarloaf Sunrise 2.jpg', author: 'Donatas Dabravolskas', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  de: { city: 'Berlin', file: 'Brandenburger Tor morgens.jpg', author: 'Thomas Wolf (foto-tw.de)', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0' },
  no: { city: 'Geirangerfjord', file: 'Fiordo de Geiranger desde Flydalsjuvet, Noruega, 2019-09-07, DD 59.jpg', author: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  ke: { city: 'Nairobi', file: 'Nairobi Skyline Savannah Kenya May19 R1600687.jpg', author: 'Timothy A. Gonsalves', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  eg: { city: 'Giza', file: 'All Gizah Pyramids.jpg', author: 'Ricardo Liberato', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0' },
  za: { city: 'Cape Town', file: 'Cape Town, Table Mountain & Harbour.jpg', author: 'SkyPixels', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  cn: { city: 'Shanghai', file: 'Pudong Shanghai November 2017 panorama.jpg', author: 'King of Hearts', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  au: { city: 'Sydney', file: 'Sydney Opera House and Harbour Bridge Dusk (3) 2019-06-21.jpg', author: 'Benh Lieu Song', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' },
  uz: { city: 'Samarkand', file: 'Registan 01.jpg', author: 'Bernard Gagnon', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
}

const commonsPage = (file) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`

async function thumbUrl(file) {
  const api = 'https://commons.wikimedia.org/w/api.php'
  const params = new URLSearchParams({
    action: 'query', format: 'json', titles: `File:${file}`,
    prop: 'imageinfo', iiprop: 'url', iiurlwidth: '1700',
  })
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(`${api}?${params}`, { headers: { 'User-Agent': UA } })
    const text = await r.text()
    if (r.status === 429 || /too many requests|you are making/i.test(text)) { await sleep(9000); continue }
    try {
      const j = JSON.parse(text)
      const p = Object.values(j.query?.pages || {})[0]
      const u = p?.imageinfo?.[0]?.thumburl
      if (u) return u
    } catch { /* retry */ }
    await sleep(4000)
  }
  throw new Error('could not resolve thumbnail')
}

async function download(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' } })
    if (r.status === 429) { await sleep(9000); continue }
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return Buffer.from(await r.arrayBuffer())
  }
  throw new Error('download rate-limited')
}

mkdirSync(OUT, { recursive: true })
const attribution = {}
let ok = 0
for (const [code, p] of Object.entries(PHOTOS)) {
  try {
    await sleep(1500)
    const url = await thumbUrl(p.file)
    const buf = await download(url)
    const dir = join(OUT, code)
    // Only clear + write once we actually have the new image in hand.
    if (existsSync(dir)) for (const f of readdirSync(dir)) rmSync(join(dir, f))
    mkdirSync(dir, { recursive: true })
    const info = await sharp(buf)
      .resize(WIDTH, Math.round((WIDTH * 9) / 16), { fit: 'cover' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(dir, '1.jpg'))
    attribution[code] = { city: p.city, author: p.author, license: p.license, licenseUrl: p.licenseUrl, source: commonsPage(p.file) }
    ok++
    console.log(`${code}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB  ${p.city} — ${p.author}, ${p.license}`)
  } catch (e) {
    console.log(`${code}  FAILED: ${e.message} (kept existing image)`)
  }
}

// Merge attribution so a partial (rate-limited) run never drops prior credits.
const prev = existsSync(DATA) ? JSON.parse(await import('node:fs').then((m) => m.readFileSync(DATA, 'utf8'))) : {}
writeFileSync(DATA, JSON.stringify({ ...prev, ...attribution }, null, 2) + '\n')
console.log(`\n${ok}/${Object.keys(PHOTOS).length} heroes written · attribution in src/data/cityPhotos.json`)
