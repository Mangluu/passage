import { CLUSTERS, topicsForCluster } from '../data/topics.js'

// Dashboard derivations. An "area score" aggregates the sourced facts in that
// area. Two rules keep it realistic and transparent (see the Sources page):
//  • where a real published index exists (freedom of expression, government
//    restriction of religion), we use its actual value — not a coarse ordinal;
//  • the remaining categorical facts are mapped onto an 8–92 band, so a single
//    "worst bucket" never collapses an area to a bare 0 (or 100).
// Every score's basis is shown on hover.

const SCORE_CLUSTERS = CLUSTERS.filter((c) => c.id !== 'duties')
const CODE2 = { identity: 'ID', body: 'BH', belief: 'FC', expression: 'EX' }

// Real 0–100 indices, by country code.
const REAL_INDEX = {
  expression: { US: 81, BR: 73, DE: 95, NO: 99, KE: 49, EG: 18, ZA: 81, CN: 9, AU: 94, UZ: 12 }, // Freedom House, Freedom in the World (2025)
  religious_freedom: { US: 64, BR: 81, DE: 61, NO: 76, KE: 68, EG: 12, ZA: 84, CN: 7, AU: 79, UZ: 19 }, // 100 − Pew Government Restrictions Index ×10
}
export const REAL_INDEX_SOURCE = { expression: 'Freedom House', religious_freedom: 'Pew Research Center' }

function goodness(topic, claim) {
  if (!claim || claim.o == null) return null
  const n = topic.scale.length - 1
  return n ? claim.o / n : 0
}

// A single topic's 0–100 score for a country.
function topicScore(topic, claim, code) {
  const real = REAL_INDEX[topic.key]
  if (real && real[code] != null) return real[code]
  const g = goodness(topic, claim)
  if (g == null) return null
  return Math.round(8 + g * 84) // categorical → indicative 8–92 band
}

function clusterScore(country, clusterId) {
  const ts = topicsForCluster(clusterId).filter((t) => t.kind === 'position')
  const vals = ts.map((t) => topicScore(t, country.claims[t.key], country.code)).filter((v) => v != null)
  if (!vals.length) return null
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

// Per-topic detail behind an area score — powers the hover tooltip.
function clusterBreakdown(country, clusterId) {
  return topicsForCluster(clusterId)
    .filter((t) => t.kind === 'position')
    .map((t) => {
      const claim = country.claims[t.key]
      const s = topicScore(t, claim, country.code)
      if (s == null) return null
      const real = REAL_INDEX[t.key] && REAL_INDEX[t.key][country.code] != null
      return { label: t.label, short: (claim && claim.short) || '', score: s, real }
    })
    .filter(Boolean)
}

export function areaScores(origin, dest) {
  return SCORE_CLUSTERS.map((c) => {
    const destScore = clusterScore(dest, c.id)
    if (destScore == null) return null
    return {
      id: c.id,
      label: c.label,
      code2: CODE2[c.id] || '··',
      destScore,
      originScore: clusterScore(origin, c.id),
      tier: tierOf(destScore),
      breakdown: clusterBreakdown(dest, c.id),
    }
  }).filter(Boolean)
}

export function overallScore(country) {
  const parts = SCORE_CLUSTERS.map((c) => ({ label: c.label, score: clusterScore(country, c.id) })).filter((p) => p.score != null)
  if (!parts.length) return { avg: null, tier: '—', breakdown: [] }
  const avg = Math.round(parts.reduce((a, b) => a + b.score, 0) / parts.length)
  return { avg, tier: tierOf(avg), breakdown: parts }
}

// A plain-text hover explanation for a score.
export function tipFrom(breakdown) {
  return (breakdown || [])
    .map((b) => `${b.label}: ${b.short || `${b.score}/100`}${b.real ? ` (index ${b.score}/100)` : ''}`)
    .join('\n')
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

// Dark "comparison summary" bullets. Shows every critical difference (so the
// list matches the "N differences are critical" line in the lede); if there are
// none, falls back to the biggest position changes of any direction.
export function summaryBullets(brief) {
  const critical = brief.changes.filter((c) => c.kind === 'position' && c.tier === 'critical')
  const src = critical.length ? critical : brief.changes.filter((c) => c.kind === 'position').slice(0, 3)
  return src.map((c) => ({ key: c.key, label: c.topic.label, note: c.claim.statement, tone: c.direction === 'restrictive' ? 'danger' : 'success' }))
}

// Advisory cards — every change flagged for the reader's audience(s); when no
// audience is selected, every change. No cap, so nothing meaningful is hidden.
export function advisoryCards(brief) {
  const flagged = brief.changes.filter((c) => c.isFor)
  const src = flagged.length ? flagged : brief.changes
  return src.map((c) => ({
    key: c.key,
    title: c.topic.label,
    sub:
      c.kind === 'duty'
        ? 'New duty on arrival'
        : c.direction === 'freer'
          ? c.tier === 'critical' ? 'Much freer than home' : 'Freer than home'
          : c.tier === 'critical' ? 'Much more restrictive' : 'More restrictive',
    body: c.claim.statement,
    tone: c.kind === 'duty' ? 'warn' : c.direction === 'restrictive' ? 'danger' : 'success',
  }))
}
