// Build-time data refresh (run: `node scripts/refresh-data.mjs`).
//
// Pulls the machine-readable, openly-licensed indices that Our World in Data
// mirrors as clean CSVs, for Passage's 10 countries, and prints the latest
// value per country. This keeps the app 100% static (no runtime API calls, no
// keys, demo-safe) while giving an authoritative, reproducible way to refresh
// the numbers in src/data/countries.js.
//
// OWID CSV docs: https://docs.owid.io/projects/etl/api/  (grapher .csv endpoint)

const COUNTRIES = {
  USA: 'US', BRA: 'BR', DEU: 'DE', NOR: 'NO', KEN: 'KE',
  EGY: 'EG', ZAF: 'ZA', CHN: 'CN', AUS: 'AU', UZB: 'UZ',
}

// aspect key in countries.js  ->  OWID grapher slug + value column
const SOURCES = [
  { aspect: 'lgbtEquality', slug: 'lgbt-legal-equality-index', col: 'ei_legal', org: 'Equaldex' },
  { aspect: 'womensRights', slug: 'women-business-and-the-law-index', col: 'sg_law_indx', org: 'World Bank WBL' },
  { aspect: 'freeExpression', slug: 'freedom-score-fh', col: 'total_score', org: 'Freedom House' },
  // NOTE: OWID's 'press-freedom-rsf' currently carries RSF's pre-2022 methodology
  // (stale ~2021 data on an INVERTED scale where lower = freer). It is deliberately
  // excluded — pressFreedom in countries.js uses curated current-scale estimates.
  // { aspect: 'pressFreedom', slug: 'press-freedom-rsf', col: 'press_freedom_score', org: 'RSF' },
]

async function fetchLatest({ slug, col }) {
  const url = `https://ourworldindata.org/grapher/${slug}.csv?csvType=full&useColumnShortNames=true`
  const res = await fetch(url, { headers: { 'User-Agent': 'passage-hackathon' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${slug}`)
  const lines = (await res.text()).trim().split('\n')
  const header = lines[0].split(',')
  const iCode = header.indexOf('code')
  const iYear = header.indexOf('year')
  const iVal = header.indexOf(col)
  if (iVal < 0) throw new Error(`column ${col} not found in ${slug} (${header.join('|')})`)

  const latest = {} // ISO3 -> { year, value }
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',')
    const code = f[iCode]
    if (!(code in COUNTRIES)) continue
    const year = Number(f[iYear])
    const value = Number(f[iVal])
    if (!latest[code] || year > latest[code].year) latest[code] = { year, value }
  }
  return latest
}

const out = {}
for (const src of SOURCES) {
  try {
    const latest = await fetchLatest(src)
    console.log(`\n# ${src.aspect}  (${src.org} via OWID: ${src.slug})`)
    for (const [iso3, code] of Object.entries(COUNTRIES)) {
      const rec = latest[iso3]
      const val = rec ? Math.round(rec.value * 10) / 10 : null
      out[`${src.aspect}.${code}`] = val
      console.log(`  ${code} ${iso3.padEnd(3)}  ${val ?? 'NO DATA'}${rec ? `  (${rec.year})` : ''}`)
    }
  } catch (e) {
    console.log(`\n# ${src.aspect}  -> FAILED: ${e.message}`)
  }
}

console.log('\n\n=== JSON (aspect.code -> value) ===')
console.log(JSON.stringify(out, null, 0))
