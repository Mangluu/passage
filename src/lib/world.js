// Tier B ("indexed") read layer over src/data/world.json — the build-time bundle
// of published indices for every country (see scripts/fetch-world.mjs). Curated
// countries (Tier A) additionally carry the full hand-verified briefing; here we
// only expose the index values, each already dated and pointing at its source.
import world from '../data/world.json'
import { scoreTone, tierOf } from './dashboard.js'

export const WORLD_GENERATED_AT = world.generatedAt
export const INDICES = world.indices
// Display order + short labels for the three indices.
export const INDEX_KEYS = ['fh_freedom', 'eq_lgbt', 'wbl_women']
export const INDEX_SHORT = {
  fh_freedom: 'Overall freedom',
  eq_lgbt: 'LGBTQ+ legal equality',
  wbl_women: "Women's legal equality",
}

const ALL = Object.entries(world.countries).map(([code, c]) => ({ code, ...c }))

export const COUNTRIES = ALL // already sorted by name in the builder
export const COUNTRY_BY_CODE = Object.fromEntries(ALL.map((c) => [c.code, c]))
export const CURATED_CODES = new Set(ALL.filter((c) => c.curated).map((c) => c.code))
export const REGIONS = [...new Set(ALL.map((c) => c.region).filter(Boolean))].sort()
export const COUNTRY_COUNT = ALL.length

export { scoreTone, tierOf }

// A single index value on a country, enriched for display (tone + tier + source meta).
export function indexView(country, key) {
  const v = country.values[key]
  if (!v) return null
  return { value: v.value, asOf: v.asOf, tone: scoreTone(v.value), tier: tierOf(v.value), meta: INDICES[key] }
}
