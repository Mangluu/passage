// Read layer over src/data/signals.json — the freshness layer that frozen model
// weights can't have. US State Department travel-advisory level for every country
// (one build-time call for the whole world) plus recent identity-relevant news
// for the curated set. Refreshed nightly by .github/workflows/refresh-signals.yml.
import raw from '../data/signals.json'

export const SIGNALS_GENERATED_AT = raw.generatedAt || null

export const ADVISORY_LABEL = {
  1: 'Exercise normal precautions',
  2: 'Exercise increased caution',
  3: 'Reconsider travel',
  4: 'Do not travel',
}
export const ADVISORY_TONE = { 1: 'success', 2: 'warn', 3: 'danger', 4: 'danger' }

export function advisoryFor(code) {
  const a = raw.advisories?.[code]
  if (!a || !a.level) return null
  return { ...a, label: ADVISORY_LABEL[a.level], tone: ADVISORY_TONE[a.level] }
}

// News for a destination, audience-relevant items first.
export function newsFor(code, audiences = []) {
  const set = new Set(audiences)
  const isFor = (n) => (n.audiences || []).some((a) => set.has(a))
  const news = [...(raw.news?.[code] || [])].sort((a, b) => (isFor(b) ? 1 : 0) - (isFor(a) ? 1 : 0))
  return { news, isFor }
}

export function signalsFor(code, audiences = []) {
  const { news, isFor } = newsFor(code, audiences)
  return { advisory: advisoryFor(code), news, isFor, generatedAt: raw.generatedAt || null }
}
