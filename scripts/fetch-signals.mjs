// Live-signals ingestion (run: `node scripts/fetch-signals.mjs`).
//
// Build-time, keyless, backend-free: pulls (1) US State Dept travel advisories
// and (2) recent identity-relevant news from GDELT DOC 2.0, for Passage's 10
// countries, and writes src/data/signals.json bundled into the static site.
// A nightly GitHub Action re-runs this and commits, so the site stays fresh
// without any server or user data. GDELT asks for <=1 request / 5s, so we do
// ONE broad query per country and classify results afterwards.

import { writeFileSync } from 'node:fs'

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'BR', name: 'Brazil' },
  { code: 'DE', name: 'Germany' },
  { code: 'NO', name: 'Norway' },
  { code: 'KE', name: 'Kenya' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'CN', name: 'China' },
  { code: 'AU', name: 'Australia' },
  { code: 'UZ', name: 'Uzbekistan' },
]

const AUDIENCE_KEYWORDS = {
  lgbtqi: ['lgbt', 'lgbtq', 'gay', 'lesbian', 'transgender', 'trans ', 'queer', 'same-sex', 'homosexual', 'pride'],
  women: ['women', 'woman', 'abortion', 'gender-based', 'femicide', "women's", 'maternal', 'reproductive'],
  religion: ['muslim', 'islam', 'hijab', 'mosque', 'religious', 'blasphemy', 'christian', 'jewish', 'antisemit', 'church'],
  poc: ['racism', 'racist', 'racial', 'hate crime', 'migrant', 'xenophob', 'ethnic', 'refugee', 'asylum'],
  disabled: ['disability', 'disabled', 'accessibility', 'wheelchair'],
}

const QUERY_TERMS =
  '(LGBT OR transgender OR gay OR lesbian OR "women\'s rights" OR abortion OR Muslim OR hijab OR "religious freedom" OR racism OR "hate crime" OR disability OR discrimination OR asylum)'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function classify(title) {
  const t = (title || '').toLowerCase()
  const out = []
  for (const [aud, kws] of Object.entries(AUDIENCE_KEYWORDS)) {
    if (kws.some((k) => t.includes(k))) out.push(aud)
  }
  return out
}

function parseSeendate(s) {
  // GDELT seendate: 20260701T120000Z
  if (!s || s.length < 8) return null
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

async function fetchAdvisories() {
  const map = {}
  try {
    const r = await fetch('https://cadataapi.state.gov/api/TravelAdvisories', { headers: { 'User-Agent': 'passage' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const arr = await r.json()
    for (const c of COUNTRIES) {
      const item = arr.find((a) => typeof a.Title === 'string' && a.Title.startsWith(c.name + ' - '))
      if (!item) continue
      const lvl = (item.Title.match(/Level (\d)/) || [])[1]
      map[c.code] = {
        level: lvl ? Number(lvl) : null,
        title: item.Title,
        link: item.Link || 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html',
        date: item.Date || item.Published || item.pubDate || null,
      }
    }
    console.log('advisories: matched', Object.keys(map).length, 'of', COUNTRIES.length)
  } catch (e) {
    console.log('advisories FAILED:', e.message)
  }
  return map
}

async function fetchNews(country) {
  const q = `${QUERY_TERMS} ${country.name} sourcelang:english`
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=ArtList&format=json&timespan=3w&maxrecords=20&sort=DateDesc`
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'passage' } })
      const text = await r.text()
      if (r.status === 429 || /limit requests/i.test(text)) {
        await sleep(8000)
        continue
      }
      const j = JSON.parse(text)
      const seen = new Set()
      const titleSeen = new Set()
      const news = []
      for (const a of j.articles || []) {
        const tkey = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 45)
        if (!a.url || seen.has(a.url) || titleSeen.has(tkey)) continue // dedup by url AND by near-identical title (kills syndicated copies)
        seen.add(a.url)
        titleSeen.add(tkey)
        const audiences = classify(a.title)
        if (!audiences.length) continue // keep only items whose title ties to an identity — drops generic noise
        news.push({ title: a.title, url: a.url, domain: a.domain, date: parseSeendate(a.seendate), audiences })
        if (news.length >= 6) break
      }
      return news
    } catch (e) {
      await sleep(3000)
    }
  }
  console.log('  news FAILED for', country.code)
  return []
}

const advisories = await fetchAdvisories()
const countries = {}
for (const c of COUNTRIES) {
  await sleep(5200) // respect GDELT's 1-req/5s guidance
  const news = await fetchNews(c)
  countries[c.code] = { advisory: advisories[c.code] || null, news }
  console.log(`${c.code}: advisory ${advisories[c.code]?.level ?? '—'} · ${news.length} news`)
}

const payload = { generatedAt: new Date().toISOString().slice(0, 10), countries }
writeFileSync('src/data/signals.json', JSON.stringify(payload, null, 2))
console.log('\nwrote src/data/signals.json')
