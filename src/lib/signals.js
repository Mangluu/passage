import raw from '../data/signals.json'

export const SIGNALS_GENERATED_AT = raw.generatedAt || null

// Live signals for a destination, sorted so audience-relevant items come first.
export function signalsFor(destCode, audiences = []) {
  const c = (raw.countries && raw.countries[destCode]) || {}
  const set = new Set(audiences)
  const isFor = (n) => (n.audiences || []).some((a) => set.has(a))
  // Only keep items our classifier could tie to an identity — drops generic noise.
  const news = [...(c.news || [])]
    .filter((n) => (n.audiences || []).length)
    .sort((a, b) => (isFor(b) ? 1 : 0) - (isFor(a) ? 1 : 0))
  return { advisory: c.advisory || null, news, isFor, generatedAt: raw.generatedAt || null }
}

export const ADVISORY_LABEL = {
  1: 'Exercise normal precautions',
  2: 'Exercise increased caution',
  3: 'Reconsider travel',
  4: 'Do not travel',
}
export const ADVISORY_TONE = { 1: 'success', 2: 'warn', 3: 'danger', 4: 'danger' }
