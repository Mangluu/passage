// World-data ingestion — the Tier B ("indexed") layer (run: `node scripts/fetch-world.mjs`).
//
// Build-time, keyless, backend-free, openly-licensed: pulls published indices
// that Our World in Data mirrors as clean CSVs — for EVERY country, across four
// domains (rights, safety, health, development) — and writes src/data/world.json
// bundled into the static site. A scheduled GitHub Action re-runs this and
// commits, so the numbers stay fresh without any server or user data.
//
// Curated countries (Tier A) additionally carry the full hand-verified briefing;
// here we expose these index values verbatim, each dated and pointing at its
// source. Metrics differ in unit and direction (homicide is lower-is-better,
// life expectancy is in years) — each carries the metadata the UI needs to
// normalise it to a 0–100 "goodness" for bars/tone while showing the raw value.
//
// OWID grapher CSV docs: https://docs.owid.io/projects/etl/api/

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ISO = JSON.parse(readFileSync(join(HERE, 'iso3166.json'), 'utf8')) // ISO3 -> { a2, region, subregion }

const CURATED = new Set(['US', 'BR', 'DE', 'NO', 'KE', 'EG', 'ZA', 'CN', 'AU', 'UZ'])

export const DOMAINS = [
  { id: 'rights', label: 'Rights & liberty' },
  { id: 'safety', label: 'Safety & integrity' },
  { id: 'health', label: 'Health' },
  { id: 'access', label: 'Development & access' },
]

// Every index: where to fetch it, how to read it, and how to interpret it.
// `min`/`max`/`higherIsBetter` drive normalisation; `unit`/`dp` drive display.
const INDICES = {
  fh_freedom: {
    slug: 'freedom-score-fh', domain: 'rights', org: 'Freedom House', name: 'Global Freedom score', short: 'Overall freedom',
    note: 'Political rights & civil liberties (0–100). Higher = freer.', url: 'https://freedomhouse.org/countries/freedom-world/scores',
    unit: '/100', min: 0, max: 100, higherIsBetter: true, dp: 0,
  },
  eq_lgbt: {
    slug: 'lgbt-legal-equality-index', domain: 'rights', org: 'Equaldex', name: 'LGBT Legal Equality Index', short: 'LGBTQ+ legal equality',
    note: 'Legal rights for LGBTQ+ people (0–100). Higher = more equal.', url: 'https://www.equaldex.com/equality-index',
    unit: '/100', min: 0, max: 100, higherIsBetter: true, dp: 0,
  },
  wbl_women: {
    slug: 'women-business-and-the-law-index', domain: 'rights', org: 'World Bank', name: 'Women, Business and the Law', short: "Women's legal equality",
    note: "Laws affecting women's economic opportunity (0–100). Higher = more equal.", url: 'https://wbl.worldbank.org/',
    unit: '/100', min: 0, max: 100, higherIsBetter: true, dp: 0,
  },
  homicide: {
    slug: 'homicide-rate-unodc', domain: 'safety', org: 'UNODC', name: 'Homicide rate', short: 'Homicide rate',
    note: 'Intentional homicides per 100,000 people. Lower = safer.', url: 'https://dataunodc.un.org/dp-intentional-homicide-victims',
    unit: '/100k', min: 0, max: 30, higherIsBetter: false, dp: 1,
  },
  corruption: {
    slug: 'corruption-perception-index', domain: 'safety', org: 'Transparency International', name: 'Corruption Perceptions Index', short: 'Absence of corruption',
    note: 'Perceived public-sector integrity (0–100). Higher = cleaner.', url: 'https://www.transparency.org/en/cpi',
    unit: '/100', min: 0, max: 100, higherIsBetter: true, dp: 0,
  },
  uhc: {
    slug: 'universal-health-coverage-index', domain: 'health', org: 'WHO', name: 'UHC Service Coverage Index', short: 'Healthcare coverage',
    note: 'Coverage of essential health services (0–100). Higher = better.', url: 'https://www.who.int/data/gho/data/themes/universal-health-coverage',
    unit: '/100', min: 0, max: 100, higherIsBetter: true, dp: 0,
  },
  life_expectancy: {
    slug: 'life-expectancy', domain: 'health', org: 'UN World Population Prospects', name: 'Life expectancy at birth', short: 'Life expectancy',
    note: 'Life expectancy at birth, in years. Higher = better.', url: 'https://ourworldindata.org/life-expectancy',
    unit: 'yrs', min: 50, max: 85, higherIsBetter: true, dp: 1,
  },
  internet: {
    slug: 'share-of-individuals-using-the-internet', domain: 'access', org: 'World Bank / ITU', name: 'Individuals using the internet', short: 'Internet access',
    note: 'Share of people using the internet. Higher = more connected.', url: 'https://data.worldbank.org/indicator/IT.NET.USER.ZS',
    unit: '%', min: 0, max: 100, higherIsBetter: true, dp: 0,
  },
  gdp_pc: {
    slug: 'gdp-per-capita-worldbank', domain: 'access', org: 'World Bank', name: 'GDP per capita (PPP)', short: 'Income level',
    note: 'GDP per capita, PPP (international $) — a rough prosperity / cost proxy.', url: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD',
    unit: '$', min: 0, max: 80000, higherIsBetter: true, dp: 0,
  },
}

const STD = new Set(['entity', 'code', 'year', 'owid_region'])

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

async function fetchIndex({ slug }) {
  const url = `https://ourworldindata.org/grapher/${slug}.csv?csvType=full&useColumnShortNames=true`
  const res = await fetch(url, { headers: { 'User-Agent': 'passage' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${slug}`)
  const lines = (await res.text()).trim().split('\n')
  const h = splitCsvLine(lines[0])
  const iCode = h.indexOf('code'), iYear = h.indexOf('year')
  // Value column = the (numeric) header that isn't entity/code/year/owid_region.
  const candidateCols = h.map((name, i) => ({ name, i })).filter((c) => !STD.has(c.name))
  const sample = splitCsvLine(lines[1] || '')
  const chosen = candidateCols.find((c) => sample[c.i] !== '' && !Number.isNaN(Number(sample[c.i]))) || candidateCols[0]
  if (!chosen) throw new Error(`no value column in ${slug} (${h.join('|')})`)
  const iVal = chosen.i

  const latest = {}
  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i])
    const code = f[iCode]
    if (!code || !ISO[code]) continue
    const year = Number(f[iYear])
    const raw = f[iVal]
    if (raw === '' || raw == null) continue
    const value = Number(raw)
    if (Number.isNaN(value)) continue
    if (!latest[code] || year > latest[code].year) latest[code] = { year, value, entity: f[h.indexOf('entity')] }
  }
  return latest
}

const round = (n, dp) => { const p = 10 ** dp; return Math.round(n * p) / p }

const results = {}
for (const [key, def] of Object.entries(INDICES)) {
  try {
    results[key] = await fetchIndex(def)
    const n = Object.keys(results[key]).length
    console.log(`${key.padEnd(16)} ${def.slug.padEnd(40)} ${n} countries  (US=${results[key].USA?.value ?? '—'})`)
  } catch (e) {
    results[key] = {}
    console.log(`${key.padEnd(16)} FAILED: ${e.message}`)
  }
}

// Merge by ISO3 -> per-country record keyed by ISO2.
const names = {}
for (const key of Object.keys(INDICES)) {
  for (const [iso3, rec] of Object.entries(results[key] || {})) if (!names[iso3]) names[iso3] = rec.entity
}

const countries = {}
for (const iso3 of Object.keys(names)) {
  const meta = ISO[iso3]
  const a2 = meta.a2
  const values = {}
  for (const [key, def] of Object.entries(INDICES)) {
    const rec = results[key]?.[iso3]
    if (rec) values[key] = { value: round(rec.value, def.dp), asOf: String(rec.year) }
  }
  if (!Object.keys(values).length) continue
  countries[a2] = {
    name: names[iso3], iso3, flag: a2.toLowerCase(), region: meta.region, subregion: meta.subregion,
    curated: CURATED.has(a2), values,
  }
}

// Public metadata (drop the internal slug) for the app.
const indices = Object.fromEntries(
  Object.entries(INDICES).map(([k, v]) => [k, {
    domain: v.domain, org: v.org, name: v.name, short: v.short, note: v.note, url: v.url,
    via: 'Our World in Data', viaUrl: `https://ourworldindata.org/grapher/${v.slug}`,
    unit: v.unit, min: v.min, max: v.max, higherIsBetter: v.higherIsBetter, dp: v.dp,
  }]),
)

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  domains: DOMAINS,
  indices,
  countries: Object.fromEntries(Object.entries(countries).sort(([, a], [, b]) => a.name.localeCompare(b.name))),
}

writeFileSync(join(HERE, '..', 'src', 'data', 'world.json'), JSON.stringify(payload, null, 2) + '\n')
const total = Object.keys(countries).length
const cur = Object.values(countries).filter((c) => c.curated).length
console.log(`\nwrote src/data/world.json — ${total} countries (${cur} curated) × ${Object.keys(INDICES).length} indices in ${DOMAINS.length} domains`)
