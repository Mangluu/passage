// Live-signals ingestion (run: `node scripts/fetch-signals.mjs`).
//
// Build-time, keyless, backend-free: pulls (1) US State Department travel
// advisory levels for EVERY country and (2) recent identity-relevant news
// (GDELT DOC 2.0) for the curated countries, and writes src/data/signals.json
// bundled into the static site. A nightly GitHub Action re-runs this and commits,
// so the freshness layer stays current without any server or user data.
//
// Advisories are one cheap call for the whole world; GDELT asks for <=1 request
// / 5s, so news is limited to the curated set to keep the run fast.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const world = JSON.parse(readFileSync(join(HERE, '..', 'src', 'data', 'world.json'), 'utf8'))
const UA = 'LibertyCompass/1.0 (personal project; github.com/Mangluu/passage)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const CURATED = [
  { code: 'US', name: 'United States' }, { code: 'BR', name: 'Brazil' }, { code: 'DE', name: 'Germany' },
  { code: 'NO', name: 'Norway' }, { code: 'KE', name: 'Kenya' }, { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' }, { code: 'CN', name: 'China' }, { code: 'AU', name: 'Australia' },
  { code: 'UZ', name: 'Uzbekistan' },
]

// State Dept country name -> ISO2, for names our normaliser can't match directly.
const ALIAS = {
  'democratic republic of the congo': 'CD', 'republic of the congo': 'CG', 'timor leste': 'TL',
  burma: 'MM', 'cote d ivoire': 'CI', 'the kyrgyz republic': 'KG', 'the gambia': 'GM',
  'cabo verde': 'CV', 'mexico travel advisory': 'MX', 'the bahamas': 'BS',
  'federated states of micronesia': 'FM', kosovo: 'XK', 'kingdom of denmark': 'DK',
  macau: 'MO', curacao: 'CW', bonaire: 'BQ',
}

const norm = (s) => (s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim()
const nameIndex = {}
for (const [code, c] of Object.entries(world.countries)) nameIndex[norm(c.name)] = code
const resolveCode = (name) => nameIndex[norm(name)] || ALIAS[norm(name)] || null

const AUDIENCE_KEYWORDS = {
  lgbtqi: ['lgbt', 'lgbtq', 'gay', 'lesbian', 'transgender', 'trans ', 'queer', 'same-sex', 'homosexual', 'pride'],
  women: ['women', 'woman', 'abortion', 'gender-based', 'femicide', "women's", 'maternal', 'reproductive'],
  religion: ['muslim', 'islam', 'hijab', 'mosque', 'religious', 'blasphemy', 'christian', 'jewish', 'antisemit', 'church'],
  poc: ['racism', 'racist', 'racial', 'hate crime', 'migrant', 'xenophob', 'ethnic', 'refugee', 'asylum'],
  disabled: ['disability', 'disabled', 'accessibility', 'wheelchair'],
}
const classify = (title) => {
  const t = (title || '').toLowerCase()
  return Object.entries(AUDIENCE_KEYWORDS).filter(([, kws]) => kws.some((k) => t.includes(k))).map(([a]) => a)
}
const parseSeendate = (s) => (!s || s.length < 8 ? null : `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`)

async function fetchAdvisories() {
  const map = {}
  try {
    const r = await fetch('https://cadataapi.state.gov/api/TravelAdvisories', { headers: { 'User-Agent': UA } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const arr = await r.json()
    for (const a of arr) {
      const title = a.Title || ''
      const m = title.match(/^(.*?)\s*-\s*Level (\d)/)
      if (!m) continue
      const code = resolveCode(m[1])
      if (!code || !world.countries[code]) continue
      map[code] = {
        level: Number(m[2]),
        link: a.Link || 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html',
        date: (a.Date || a.Published || '').slice(0, 10) || null,
      }
    }
    console.log(`advisories: matched ${Object.keys(map).length} countries`)
  } catch (e) {
    console.log('advisories FAILED:', e.message)
  }
  return map
}

const QUERY =
  '(LGBT OR transgender OR "women\'s rights" OR abortion OR Muslim OR "religious freedom" OR racism OR "hate crime" OR disability OR protest OR crackdown OR discrimination OR asylum)'

async function fetchNews(country) {
  const q = `${QUERY} ${country.name} sourcelang:english`
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=ArtList&format=json&timespan=3w&maxrecords=20&sort=DateDesc`
  // Time-bounded so a flaky/rate-limited GDELT can never hang the run: one attempt,
  // hard 8s timeout, and we simply skip (news is a nice-to-have; advisories aren't).
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) })
    const text = await r.text()
    if (r.status === 429 || /limit requests/i.test(text) || !text.trim().startsWith('{')) { console.log('  news skipped for', country.code); return [] }
    const j = JSON.parse(text)
    const seenUrl = new Set(), seenTitle = new Set(), news = []
    for (const a of j.articles || []) {
      const tkey = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 45)
      if (!a.url || seenUrl.has(a.url) || seenTitle.has(tkey)) continue
      seenUrl.add(a.url); seenTitle.add(tkey)
      const audiences = classify(a.title)
      if (!audiences.length) continue
      news.push({ title: a.title, url: a.url, domain: a.domain, date: parseSeendate(a.seendate), audiences })
      if (news.length >= 6) break
    }
    return news
  } catch { console.log('  news skipped for', country.code); return [] }
}

const advisories = await fetchAdvisories()
const news = {}
for (const c of CURATED) {
  await sleep(5200) // respect GDELT's 1-req/5s guidance
  news[c.code] = await fetchNews(c)
  console.log(`${c.code}: advisory ${advisories[c.code]?.level ?? '—'} · ${news[c.code].length} news`)
}

const payload = { generatedAt: new Date().toISOString().slice(0, 10), advisories, news }
writeFileSync(join(HERE, '..', 'src', 'data', 'signals.json'), JSON.stringify(payload, null, 2) + '\n')
console.log(`\nwrote src/data/signals.json — ${Object.keys(advisories).length} advisories, news for ${CURATED.length} curated`)
