import { CLUSTERS, topicsForCluster } from '../data/topics.js'
import { TIER } from './format.js'

// Threshold-style dashboard derivations, computed from our real claims.
// An "area score" is an honest aggregate of the ordinal positions of the
// sourced facts in that area (each of which is cited in the detail below) —
// not an invented index.

const SCORE_CLUSTERS = CLUSTERS.filter((c) => c.id !== 'duties')
const CODE2 = { identity: 'ID', body: 'BH', belief: 'FC', expression: 'EX' }

function goodness(topic, claim) {
  if (!claim || claim.o == null) return null
  const n = topic.scale.length - 1
  return n ? claim.o / n : 0
}

function clusterScore(country, clusterId) {
  const ts = topicsForCluster(clusterId).filter((t) => t.kind === 'position')
  const vals = ts.map((t) => goodness(t, country.claims[t.key])).filter((v) => v != null)
  if (!vals.length) return null
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100)
}

export function areaScores(origin, dest) {
  return SCORE_CLUSTERS.map((c) => {
    const destScore = clusterScore(dest, c.id)
    if (destScore == null) return null
    return { id: c.id, label: c.label, code2: CODE2[c.id] || '··', destScore, originScore: clusterScore(origin, c.id) }
  }).filter(Boolean)
}

export function overallScore(country) {
  const vals = SCORE_CLUSTERS.map((c) => clusterScore(country, c.id)).filter((v) => v != null)
  if (!vals.length) return { avg: null, tier: '—' }
  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  return { avg, tier: tierOf(avg) }
}

export function tierOf(s) {
  if (s == null) return '—'
  if (s >= 70) return 'Strong'
  if (s >= 45) return 'Moderate'
  if (s >= 25) return 'Limited'
  return 'Restricted'
}

export function scoreTone(s) {
  if (s == null) return 'ink3'
  if (s >= 67) return 'success'
  if (s >= 34) return 'warn'
  return 'danger'
}

// Dark "comparison summary" bullets — the biggest restrictive shifts (fall back
// to the biggest changes of any direction if the destination is freer overall).
export function summaryBullets(brief) {
  const restrictive = brief.changes.filter((c) => c.kind === 'position' && c.direction === 'restrictive')
  const src = restrictive.length ? restrictive : brief.changes.filter((c) => c.kind === 'position')
  return src.slice(0, 3).map((c) => ({ key: c.key, label: c.topic.label, note: c.claim.statement, tone: c.direction === 'restrictive' ? 'danger' : 'success' }))
}

// Advisory cards — the changes flagged for the reader's audience(s).
export function advisoryCards(brief) {
  const flagged = brief.changes.filter((c) => c.isFor)
  const src = flagged.length ? flagged : brief.changes
  return src.slice(0, 4).map((c) => ({
    key: c.key,
    title: c.topic.label,
    sub: c.kind === 'duty' ? 'New duty' : (TIER[c.tier] || TIER.minor).label,
    body: c.claim.statement,
    tone: c.kind === 'duty' ? 'warn' : c.direction === 'restrictive' ? 'danger' : 'success',
  }))
}
