// World-data ingestion — the Tier B ("indexed") layer (run: `node scripts/fetch-world.mjs`).
//
// Build-time, keyless, backend-free, and openly-licensed: pulls three published
// indices that Our World in Data mirrors as clean CSVs — for EVERY country, not
// just the ten we curate by hand — and writes src/data/world.json bundled into
// the static site. A scheduled GitHub Action re-runs this and commits, so the
// numbers stay fresh without any server or user data ever leaving the browser.
//
// This is the honest scaling answer: curated countries (Tier A) get the full
// hand-verified briefing; every other country (Tier B) gets these index values
// verbatim, each linked and dated, clearly labelled "indexed — not yet verified".
// Nothing is invented; a country with no value for an index simply omits it.
//
// OWID grapher CSV docs: https://docs.owid.io/projects/etl/api/

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ISO = JSON.parse(readFileSync(join(HERE, 'iso3166.json'), 'utf8')) // ISO3 -> { a2, region, subregion }

// The ten hand-verified jurisdictions (ISO2). Kept in sync with src/data/jurisdictions.js.
const CURATED = new Set(['US', 'BR', 'DE', 'NO', 'KE', 'EG', 'ZA', 'CN', 'AU', 'UZ'])

// index key -> { OWID grapher slug, value column, display metadata }.
// Every value in world.json points back to one of these; the UI shows org + date + link.
const INDICES = {
  fh_freedom: {
    slug: 'freedom-score-fh',
    col: 'total_score',
    org: 'Freedom House',
    name: 'Global Freedom score',
    note: 'Aggregate of political rights & civil liberties (0–100). Higher = freer.',
    url: 'https://freedomhouse.org/countries/freedom-world/scores',
    viaUrl: 'https://ourworldindata.org/grapher/freedom-score-fh',
  },
  eq_lgbt: {
    slug: 'lgbt-legal-equality-index',
    col: 'ei_legal',
    org: 'Equaldex',
    name: 'LGBT Legal Equality Index',
    note: 'Legal rights for LGBTQ+ people (0–100). Higher = more equal.',
    url: 'https://www.equaldex.com/equality-index',
    viaUrl: 'https://ourworldindata.org/grapher/lgbt-legal-equality-index',
  },
  wbl_women: {
    slug: 'women-business-and-the-law-index',
    col: 'sg_law_indx',
    org: 'World Bank',
    name: 'Women, Business and the Law Index',
    note: "Laws affecting women's economic opportunity (0–100). Higher = more equal.",
    url: 'https://wbl.worldbank.org/',
    viaUrl: 'https://ourworldindata.org/grapher/women-business-and-the-law-index',
  },
}

// Minimal RFC-4180-ish line splitter (handles quoted fields with commas, just in case).
function splitCsvLine(line) {
  const out = []
  let cur = '', q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (q) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (ch === '"') q = false
      else cur += ch
    } else if (ch === '"') q = true
    else if (ch === ',') { out.push(cur); cur = '' }
    else cur += ch
  }
  out.push(cur)
  return out
}

async function fetchIndex({ slug, col }) {
  const url = `https://ourworldindata.org/grapher/${slug}.csv?csvType=full&useColumnShortNames=true`
  const res = await fetch(url, { headers: { 'User-Agent': 'passage' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${slug}`)
  const lines = (await res.text()).trim().split('\n')
  const h = splitCsvLine(lines[0])
  const iEnt = h.indexOf('entity'), iCode = h.indexOf('code'), iYear = h.indexOf('year'), iVal = h.indexOf(col)
  if (iVal < 0) throw new Error(`column ${col} not found in ${slug} (${h.join('|')})`)

  const latest = {} // ISO3 -> { year, value, entity }
  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i])
    const code = f[iCode]
    if (!code || !ISO[code]) continue // real ISO3 only — drops OWID_* synthetic + non-country aggregates
    const year = Number(f[iYear])
    const raw = f[iVal]
    if (raw === '' || raw == null) continue
    const value = Number(raw)
    if (Number.isNaN(value)) continue
    if (!latest[code] || year > latest[code].year) latest[code] = { year, value, entity: f[iEnt] }
  }
  return latest
}

const round1 = (n) => Math.round(n * 10) / 10

const results = {}
for (const [key, def] of Object.entries(INDICES)) {
  try {
    results[key] = await fetchIndex(def)
    console.log(`${key.padEnd(11)} ${def.slug.padEnd(34)} ${Object.keys(results[key]).length} countries`)
  } catch (e) {
    results[key] = {}
    console.log(`${key.padEnd(11)} FAILED: ${e.message}`)
  }
}

// Merge by ISO3 -> emit a per-country record keyed by ISO2 (matching the app + flags).
const countries = {}
const names = {} // ISO3 -> best display name (prefer FH's entity naming, then others)
for (const key of ['fh_freedom', 'eq_lgbt', 'wbl_women']) {
  for (const [iso3, rec] of Object.entries(results[key] || {})) {
    if (!names[iso3]) names[iso3] = rec.entity
  }
}

for (const iso3 of Object.keys(names)) {
  const meta = ISO[iso3]
  const a2 = meta.a2
  const values = {}
  for (const key of Object.keys(INDICES)) {
    const rec = results[key]?.[iso3]
    if (rec) values[key] = { value: round1(rec.value), asOf: String(rec.year) }
  }
  if (!Object.keys(values).length) continue
  countries[a2] = {
    name: names[iso3],
    iso3,
    flag: a2.toLowerCase(),
    region: meta.region,
    subregion: meta.subregion,
    curated: CURATED.has(a2),
    values,
  }
}

// Strip the internal slug/col before writing — the app only needs display metadata.
const indices = Object.fromEntries(
  Object.entries(INDICES).map(([k, v]) => [k, {
    org: v.org, name: v.name, note: v.note, url: v.url, via: 'Our World in Data', viaUrl: v.viaUrl,
    min: 0, max: 100, higherIsBetter: true,
  }]),
)

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  indices,
  countries: Object.fromEntries(
    Object.entries(countries).sort(([, a], [, b]) => a.name.localeCompare(b.name)),
  ),
}

writeFileSync(join(HERE, '..', 'src', 'data', 'world.json'), JSON.stringify(payload, null, 2) + '\n')
const total = Object.keys(countries).length
const curatedCount = Object.values(countries).filter((c) => c.curated).length
console.log(`\nwrote src/data/world.json — ${total} countries (${curatedCount} curated, ${total - curatedCount} indexed-only)`)
