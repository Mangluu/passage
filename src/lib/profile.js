import { POSITION_TOPICS } from '../data/topics.js'

// A single-country read for ONE identity — the basis of the "Is {country} safe
// for {identity}?" page. Unlike the briefing (which compares home→destination),
// this stands on its own: it gathers the sourced claims that weigh for the
// reader's identity, worst-first, and rolls them into an indicative verdict.
// It never invents — a country with no claim for a topic simply omits it.

function toneOf(g) {
  if (g == null) return 'ink3'
  if (g >= 0.67) return 'success'
  if (g >= 0.34) return 'warn'
  return 'danger'
}

export function profileFor(country, aud) {
  const topics = POSITION_TOPICS.filter((t) => (aud ? t.audiences.includes(aud) : true))
  const items = topics
    .map((t) => {
      const claim = country.claims?.[t.key]
      if (!claim || claim.o == null) return null
      const g = t.scale.length > 1 ? claim.o / (t.scale.length - 1) : 0
      return { key: t.key, topic: t, claim, g, tone: toneOf(g), band: t.scale[claim.o] }
    })
    .filter(Boolean)
    .sort((a, b) => a.g - b.g) // concerns first

  const avg = items.length ? items.reduce((s, i) => s + i.g, 0) / items.length : null
  const tier =
    avg == null
      ? null
      : avg >= 0.72
        ? 'Broadly safe'
        : avg >= 0.42
          ? 'Mixed — know the gaps'
          : 'Significant restrictions'
  // Same indicative 8–92 band the dashboard uses for categorical facts.
  const score = avg == null ? null : Math.round(8 + avg * 84)
  return { items, avg, tier, tone: toneOf(avg), score }
}

// A grounded one-line verdict, built from the actual claims (no fabrication).
export function verdictLine(country, phrase, prof) {
  if (!prof.items.length) return `We don’t yet hold ${phrase}-specific sourced claims for ${country.name}.`
  const worst = prof.items[0]
  const concerns = prof.items.filter((i) => i.tone !== 'success').length
  const lead = {
    'Broadly safe': `${country.name} is broadly protective for ${phrase} in law`,
    'Mixed — know the gaps': `${country.name} is a mixed picture for ${phrase}`,
    'Significant restrictions': `${country.name} carries significant legal restrictions for ${phrase}`,
  }[prof.tier]
  const tail = concerns
    ? ` — the clearest concern is ${worst.topic.label.toLowerCase()} (${worst.band.toLowerCase()}).`
    : ' across every area we track.'
  return lead + tail
}
