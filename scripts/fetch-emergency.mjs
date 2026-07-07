// Emergency-numbers ingestion (run: `node scripts/fetch-emergency.mjs`).
//
// Build-time, keyless: pulls emergency telephone numbers for every country from
// the open Emergency Number API and writes a compact src/data/emergency.json
// keyed by ISO2. Lets every destination — not just the curated ten — show a
// Quick-info panel and a "save the local emergency number" checklist item.
//
// Source: emergencynumberapi.com (data compiled from public/official sources).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ISO = JSON.parse(readFileSync(join(HERE, 'iso3166.json'), 'utf8'))
const VALID = new Set(Object.values(ISO).map((x) => x.a2))
const UA = 'LibertyCompass/1.0 (personal project; github.com/Mangluu/passage)'

const first = (arr) => (Array.isArray(arr) ? arr.find((v) => v && v.trim()) : null) || null

const res = await fetch('https://emergencynumberapi.com/api/data/all', { headers: { 'User-Agent': UA } })
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const payload = await res.json()
const list = Array.isArray(payload) ? payload : payload.data || Object.values(payload)

const out = {}
for (const c of list) {
  const code = c.Country?.ISOCode
  if (!code || !VALID.has(code)) continue
  const police = first(c.Police?.All)
  const ambulance = first(c.Ambulance?.All)
  const fire = first(c.Fire?.All)
  const dispatch = first(c.Dispatch?.All)
  const general = (c.Member_112 ? '112' : null) || dispatch || police || ambulance || fire
  if (!general && !police && !ambulance && !fire) continue
  out[code] = {
    general: general || police || '',
    police: police || general || '',
    ambulance: ambulance || general || '',
    fire: fire || general || '',
    via112: !!c.Member_112,
  }
}

writeFileSync(join(HERE, '..', 'src', 'data', 'emergency.json'),
  JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), source: { org: 'Emergency Number API', url: 'https://emergencynumberapi.com/' }, numbers: out }) + '\n')
console.log(`wrote src/data/emergency.json — ${Object.keys(out).length} countries`)
