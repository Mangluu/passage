// Tier B ("indexed") read layer over src/data/world.json — the build-time bundle
// of published indices for every country, across four domains (see
// scripts/fetch-world.mjs). Metrics differ in unit and direction, so each value
// is normalised to a 0–100 "goodness" (higher = better, always) for bars + tone,
// while the raw value is shown with its unit. Nothing here is invented; a country
// without a value for an index simply omits it.
import world from '../data/world.json'

export const WORLD_GENERATED_AT = world.generatedAt
export const DOMAINS = world.domains
export const INDICES = world.indices
export const INDEX_KEYS = Object.keys(world.indices)
export const INDEX_SHORT = Object.fromEntries(INDEX_KEYS.map((k) => [k, world.indices[k].short]))
// Domains with their ordered index keys — the grouping every surface uses.
export const DOMAIN_KEYS = DOMAINS.map((d) => ({ ...d, keys: INDEX_KEYS.filter((k) => INDICES[k].domain === d.id) }))

const ALL = Object.entries(world.countries).map(([code, c]) => ({ code, ...c }))
export const COUNTRIES = ALL // already name-sorted by the builder
export const COUNTRY_BY_CODE = Object.fromEntries(ALL.map((c) => [c.code, c]))
export const CURATED_CODES = new Set(ALL.filter((c) => c.curated).map((c) => c.code))
export const REGIONS = [...new Set(ALL.map((c) => c.region).filter(Boolean))].sort()
export const COUNTRY_COUNT = ALL.length

// Raw value → 0–100 goodness, respecting each metric's range + direction.
export function normalize(meta, value) {
  const span = (meta.max - meta.min) || 1
  const g = meta.higherIsBetter ? (value - meta.min) / span : (meta.max - value) / span
  return Math.max(0, Math.min(100, Math.round(g * 100)))
}

// Raw value → display string with unit.
export function formatValue(meta, value) {
  if (meta.unit === '$') return '$' + (value >= 1000 ? (value / 1000).toFixed(value >= 10000 ? 0 : 1) + 'k' : Math.round(value))
  const v = meta.dp ? value.toFixed(meta.dp) : String(Math.round(value))
  if (meta.unit === '%') return v + '%'
  if (meta.unit === '/100') return v + '/100'
  if (meta.unit === '/100k') return v + '/100k'
  if (meta.unit === 'yrs') return v + ' yrs'
  return v
}

export function tone(norm) {
  if (norm == null) return 'ink3'
  if (norm >= 67) return 'success'
  if (norm >= 34) return 'warn'
  return 'danger'
}

// A single index value on a country, enriched for display.
export function indexView(country, key) {
  const raw = country.values[key]
  if (!raw) return null
  const meta = INDICES[key]
  const norm = normalize(meta, raw.value)
  return { value: raw.value, asOf: raw.asOf, norm, tone: tone(norm), display: formatValue(meta, raw.value), meta }
}

export const availableCount = (country) => INDEX_KEYS.filter((k) => country.values[k]).length

// Average normalised goodness (0–100) across a set of index keys for a country.
function meanNorm(country, keys) {
  const vals = keys.map((k) => (country.values[k] ? normalize(INDICES[k], country.values[k].value) : null)).filter((v) => v != null)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
}

// Overall standing = mean normalised goodness across all available indices.
export const overallIndex = (country) => meanNorm(country, INDEX_KEYS)

// Per-domain normalised score (mean of that domain's available metrics).
export function domainScores(country) {
  return DOMAIN_KEYS.map((d) => ({ id: d.id, label: d.label, score: meanNorm(country, d.keys) })).filter((d) => d.score != null)
}

// The indices that differ most between two countries, by normalised gap.
export function topChanges(origin, dest, limit = 4) {
  return INDEX_KEYS
    .map((k) => {
      const o = indexView(origin, k), d = indexView(dest, k)
      if (!o || !d) return null
      return { key: k, meta: INDICES[k], home: o, dest: d, gap: d.norm - o.norm }
    })
    .filter(Boolean)
    .filter((c) => Math.abs(c.gap) >= 6)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, limit)
}

export const tierLabel = (score) => (score == null ? '—' : score >= 70 ? 'Strong' : score >= 45 ? 'Moderate' : score >= 25 ? 'Limited' : 'Restricted')
