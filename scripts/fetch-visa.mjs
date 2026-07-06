// Visa / entry-requirement ingestion (run: `node scripts/fetch-visa.mjs`).
//
// Build-time, keyless: pulls the open Passport Index dataset (a 199×199 matrix of
// what each passport needs to enter each destination) and writes a compact
// src/data/visa.json keyed by ISO2. This is the one genuinely pairwise fact in
// the app — it depends on BOTH your home passport and your destination — so it
// slots straight into the home → destination model.
//
// Source: github.com/ilyankou/passport-index-dataset (CC-BY-4.0).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ISO = JSON.parse(readFileSync(join(HERE, 'iso3166.json'), 'utf8')) // ISO3 -> { a2, ... }
const a2 = (iso3) => ISO[iso3]?.a2 || null
const UA = 'LibertyCompass/1.0 (personal project; github.com/Mangluu/passage)'
const URL = 'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-tidy-iso3.csv'

// Compact encoding: a number = visa-free days; letters for the categorical cases.
function encode(v) {
  if (/^\d+$/.test(v)) return Number(v)
  const s = v.toLowerCase().trim()
  if (s.includes('visa free') || s === 'visa-free') return 'vf'
  if (s.includes('on arrival')) return 'voa'
  if (s.includes('e-visa') || s.includes('evisa') || s.includes('eta')) return 'evisa'
  if (s.includes('no admission') || s === '-1' || s.includes('covid')) return 'no'
  return 'req' // "visa required" and anything unrecognised → conservative default
}

const res = await fetch(URL, { headers: { 'User-Agent': UA } })
if (!res.ok) throw new Error(`HTTP ${res.status} for passport-index`)
const lines = (await res.text()).trim().split('\n')

const matrix = {}
let pairs = 0
for (let i = 1; i < lines.length; i++) {
  const [pIso3, dIso3, req] = lines[i].split(',')
  const from = a2(pIso3), to = a2(dIso3)
  if (!from || !to || from === to) continue
  ;(matrix[from] ||= {})[to] = encode(req)
  pairs++
}

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source: { org: 'Passport Index (Ilya Ilyankou / Iuliia Semikova)', url: 'https://github.com/ilyankou/passport-index-dataset', license: 'CC BY 4.0' },
  matrix,
}
writeFileSync(join(HERE, '..', 'src', 'data', 'visa.json'), JSON.stringify(payload) + '\n')
console.log(`wrote src/data/visa.json — ${Object.keys(matrix).length} passports, ${pairs} pairs`)
