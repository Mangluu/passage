import { COMPARABLE_ASPECTS, CLUSTERS, ASPECTS } from '../data/aspects.js'
import { GROUP_BY_ID } from '../data/groups.js'
import { scaleMaxOrdinal } from './scales.js'

// Normalise any comparable aspect to a 0..1 "goodness" score where 1 = most
// free/safe. This unifies indices with different scales & directions so origin
// and destination can be diffed on a single axis.
export function goodness(aspect, entry) {
  if (!entry) return null
  if (aspect.type === 'score') {
    if (entry.value == null) return null
    const frac = clamp01(entry.value / aspect.max)
    return aspect.direction === 'higher' ? frac : 1 - frac
  }
  if (aspect.type === 'status') {
    if (entry.ordinal == null) return null
    const frac = clamp01(entry.ordinal / scaleMaxOrdinal(aspect.scale))
    return aspect.direction === 'higher' ? frac : 1 - frac
  }
  return null
}

const MEANINGFUL = 0.12 // ≥12% of the range counts as a real change

function isGroupRelevant(aspectKey, selectedIds) {
  return selectedIds.some((id) => GROUP_BY_ID[id]?.priorityAspects.includes(aspectKey))
}

// Build the ranked "what changes vs home" list.
export function computeDeltas(origin, dest, selectedIds = []) {
  if (!origin || !dest) return []
  const rows = []
  for (const aspect of COMPARABLE_ASPECTS) {
    const oG = goodness(aspect, origin.aspects[aspect.key])
    const dG = goodness(aspect, dest.aspects[aspect.key])
    if (oG == null || dG == null) continue
    const delta = dG - oG
    rows.push({
      key: aspect.key,
      aspect,
      originGoodness: oG,
      destGoodness: dG,
      delta,
      direction: delta <= -MEANINGFUL ? 'restrictive' : delta >= MEANINGFUL ? 'freer' : 'similar',
      groupRelevant: isGroupRelevant(aspect.key, selectedIds),
    })
  }
  // Group-relevant first, then biggest restrictions (most negative) first.
  rows.sort((a, b) => {
    if (a.groupRelevant !== b.groupRelevant) return a.groupRelevant ? -1 : 1
    return a.delta - b.delta
  })
  return rows
}

// The subset that actually differs — what the strip shows.
export function meaningfulChanges(origin, dest, selectedIds = []) {
  return computeDeltas(origin, dest, selectedIds).filter((r) => r.direction !== 'similar')
}

// Per-cluster average goodness (0..100) for the radar overview.
export function clusterScores(origin, dest) {
  return CLUSTERS.map((cluster) => {
    const aspects = ASPECTS.filter((a) => a.cluster === cluster.id && a.type !== 'text')
    return {
      cluster: cluster.id,
      label: cluster.label,
      origin: avgGoodness(aspects, origin),
      dest: avgGoodness(aspects, dest),
    }
  })
}

function avgGoodness(aspects, country) {
  if (!country) return null
  const vals = aspects.map((a) => goodness(a, country.aspects[a.key])).filter((v) => v != null)
  if (!vals.length) return null
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100)
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}
