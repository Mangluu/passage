import { statusEntry } from './scales.js'
import { goodness } from './compare.js'
import { goodnessToTone } from './scales.js'

// A short human label for any aspect value (used in the delta strip & tags).
export function valueLabel(aspect, entry) {
  if (!entry) return 'No data'
  if (aspect.type === 'score') {
    return entry.value == null ? 'No data' : `${entry.value}${aspect.max === 100 ? '' : `/${aspect.max}`}`
  }
  if (aspect.type === 'status') {
    if (entry.ordinal == null) return 'No data'
    return entry.label || statusEntry(aspect.scale, entry.ordinal)?.label || '—'
  }
  return ''
}

// Tone key ('bad'|'warn'|'ok'|'good'|'na') for colouring a value.
export function toneForEntry(aspect, entry) {
  if (aspect.type === 'status') {
    const e = statusEntry(aspect.scale, entry?.ordinal)
    return e ? e.tone : 'na'
  }
  return goodnessToTone(goodness(aspect, entry))
}
