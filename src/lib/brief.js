import { TOPICS, POSITION_TOPICS, OBLIGATION_TOPICS, CLUSTERS, topicsForCluster } from '../data/topics.js'
import { positionDelta, obligationSeverity, TIER_RANK } from './severity.js'

// Assemble the whole briefing from origin, destination and the reader's audiences.
export function buildBrief(origin, dest, audiences = []) {
  if (!origin || !dest) return null
  const isFor = (topic) => topic.audiences.some((a) => audiences.includes(a))

  const changes = []
  let critical = 0
  let notable = 0
  let minor = 0
  let unchanged = 0
  let netScore = 0

  // Position deltas.
  for (const topic of POSITION_TOPICS) {
    const oc = origin.claims[topic.key]
    const dc = dest.claims[topic.key]
    const forMe = isFor(topic)
    const d = positionDelta(topic, oc, dc, forMe)
    if (!d) {
      if (oc && dc && oc.o != null && dc.o != null) unchanged++
      continue
    }
    netScore += d.delta * topic.weight * (forMe ? 1.5 : 1)
    if (d.tier === 'critical') critical++
    else if (d.tier === 'notable') notable++
    else minor++
    changes.push({
      kind: 'position',
      key: topic.key,
      topic,
      tier: d.tier,
      direction: d.direction,
      magnitude: Math.abs(d.delta),
      from: oc.short,
      to: dc.short,
      claim: dc,
      isFor: forMe,
    })
  }

  // New duties (destination obligations).
  for (const topic of OBLIGATION_TOPICS) {
    const dc = dest.claims[topic.key]
    const sev = obligationSeverity(dc)
    if (!sev) continue
    if (sev === 'notable') notable++
    else minor++
    changes.push({
      kind: 'duty',
      key: topic.key,
      topic,
      tier: sev,
      direction: 'duty',
      magnitude: dc.deadlineDays != null ? 1 / (dc.deadlineDays + 1) : 0,
      claim: dc,
      isFor: isFor(topic),
    })
  }

  changes.sort((a, b) => {
    if (TIER_RANK[a.tier] !== TIER_RANK[b.tier]) return TIER_RANK[a.tier] - TIER_RANK[b.tier]
    if (a.isFor !== b.isFor) return a.isFor ? -1 : 1
    return b.magnitude - a.magnitude
  })

  return {
    origin,
    dest,
    audiences,
    changes,
    counts: { critical, notable, minor, unchanged },
    checklist: buildChecklist(origin, dest),
    insights: buildInsights(origin, dest),
    facts: buildFacts(dest, isFor),
    updated: countUpdated(dest),
    lede: buildLede(origin, dest, audiences, { critical, notable }, netScore, changes),
  }
}

function buildChecklist(origin, dest) {
  const items = []
  const reg = dest.claims.residence_registration
  if (reg && reg.required) {
    items.push({
      label: 'Register your address / residence',
      timing: reg.timing,
      deadlineDays: reg.deadlineDays ?? null,
      urgent: reg.deadlineDays != null && reg.deadlineDays <= 14,
      src: reg.src,
    })
  }
  const ins = dest.claims.health_insurance
  if (ins && ins.required) {
    items.push({ label: 'Arrange required health insurance', timing: ins.timing, deadlineDays: null, urgent: false, src: ins.src })
  }
  const med = dest.claims.medication_import
  if (med) {
    items.push({ label: "Doctor's letter + packaging for any prescription meds", timing: '4 weeks before departure', deadlineDays: null, urgent: false, src: med.src })
  }
  items.push({ label: `Save your ${origin.name} embassy / consulate contact in ${dest.name}`, timing: 'before departure', deadlineDays: null, urgent: false, src: { org: 'Your foreign ministry', url: '' } })
  items.push({ label: `Save local emergency numbers (${dest.emergency.general})`, timing: 'before departure', deadlineDays: null, urgent: false, src: { org: 'Local authorities', url: '' } })
  return items
}

function buildInsights(origin, dest) {
  const out = []
  const oc = origin.claims.cannabis
  const dc = dest.claims.cannabis
  if (oc && dc && oc.o != null && dc.o != null && dc.o >= 2 && oc.o <= 1) {
    out.push({
      tone: 'danger',
      title: 'The return trip',
      text: `Cannabis is legal or tolerated in ${dest.name}, but a serious offence at home — never carry any back or return with it in your system. ${origin.name}'s law is what applies to you on your return.`,
    })
  }
  return out
}

function buildFacts(dest, isFor) {
  return CLUSTERS.map((cluster) => ({
    cluster: cluster.id,
    label: cluster.label,
    items: topicsForCluster(cluster.id)
      .map((topic) => ({ topic, claim: dest.claims[topic.key], isFor: isFor(topic) }))
      .filter((x) => x.claim)
      .sort((a, b) => (a.isFor === b.isFor ? 0 : a.isFor ? -1 : 1)),
  })).filter((c) => c.items.length)
}

function countUpdated(dest) {
  return TOPICS.reduce((n, t) => {
    const c = dest.claims[t.key]
    if (!c) return n
    const recent = c.changed || Number(String(c.asOf).slice(0, 4)) >= 2024
    return n + (recent ? 1 : 0)
  }, 0)
}

function buildLede(origin, dest, audiences, counts, netScore, changes) {
  const net = netScore > 0.4 ? 'broadly freer' : netScore < -0.4 ? 'broadly more restrictive' : 'a mix of freer and more restrictive'
  const who = audiences.length ? 'the things you flagged' : 'the things we track'
  const crit = counts.critical
  const critClause = crit ? ` — but ${crit} ${crit === 1 ? 'difference is' : 'differences are'} critical` : ''
  const soon = changes.filter((c) => c.kind === 'duty' && c.claim.deadlineDays != null && c.claim.deadlineDays <= 14).length
  const soonClause = soon ? `, and ${soon} ${soon === 1 ? 'creates a deadline' : 'create deadlines'} in your first days` : ''
  return `${dest.name} is ${net} than ${origin.name} on ${who}${critClause}${soonClause}.`
}
