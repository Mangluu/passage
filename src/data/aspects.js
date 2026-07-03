// The aspect catalog — the "schema" for every country record.
//
// type:      'score'  → numeric index, rendered as a bar
//            'status' → categorical, rendered as a badge (ordinal lives in scales.js)
//            'text'   → curated prose, not part of the comparison lens
// direction: 'higher' → a higher value means MORE freedom/safety (good)
//            'lower'  → a lower value means more freedom/safety (e.g. restriction indices)
// scale:     name of the ordinal map in scales.js (status aspects only)
// max:       full-scale value for the bar (score aspects only)
// sourceKey: key into data/sources.js
// hint:      tiny clarifier shown under the value

export const CLUSTERS = [
  { id: 'health', label: 'Bodily autonomy & health', icon: 'HeartPulse' },
  { id: 'legal', label: 'Legal status & policing', icon: 'Scale' },
  { id: 'identity', label: 'Identity rights & anti-discrimination', icon: 'Users' },
  { id: 'safety', label: 'Safety', icon: 'ShieldCheck' },
  { id: 'expression', label: 'Expression & digital', icon: 'Megaphone' },
  { id: 'everyday', label: 'Everyday life', icon: 'Landmark' },
]

export const ASPECTS = [
  // ── Bodily autonomy & health ─────────────────────────────────────────────
  { key: 'abortion', label: 'Abortion access', cluster: 'health', type: 'status', direction: 'higher', scale: 'abortion', sourceKey: 'crr' },
  { key: 'healthcareAccess', label: 'Healthcare access for students', cluster: 'health', type: 'text', sourceKey: 'curated' },
  { key: 'vaccinations', label: 'Vaccination / entry health rules', cluster: 'health', type: 'text', sourceKey: 'who' },
  { key: 'genderCare', label: 'Gender-affirming care', cluster: 'health', type: 'status', direction: 'higher', scale: 'genderCare', sourceKey: 'equaldex' },

  // ── Legal status & policing ──────────────────────────────────────────────
  { key: 'cannabis', label: 'Cannabis & drug law', cluster: 'legal', type: 'status', direction: 'higher', scale: 'cannabis', sourceKey: 'cannabis' },
  { key: 'customs', label: 'Customs — what you may bring', cluster: 'legal', type: 'text', sourceKey: 'curated' },
  { key: 'police', label: 'Police & how they treat you', cluster: 'legal', type: 'text', sourceKey: 'curated' },
  { key: 'gotchaLaws', label: 'Unexpected laws', cluster: 'legal', type: 'text', sourceKey: 'curated' },
  { key: 'blasphemy', label: 'Blasphemy / "propaganda" laws', cluster: 'legal', type: 'status', direction: 'higher', scale: 'blasphemy', sourceKey: 'pew' },

  // ── Identity rights & anti-discrimination ────────────────────────────────
  { key: 'lgbtEquality', label: 'LGBTQI+ legal equality', cluster: 'identity', type: 'score', direction: 'higher', max: 100, sourceKey: 'equaldex', hint: '0–100, higher = more equal' },
  { key: 'sameSex', label: 'Same-sex relationships', cluster: 'identity', type: 'status', direction: 'higher', scale: 'sameSex', sourceKey: 'equaldex' },
  { key: 'womensRights', label: "Women's legal rights", cluster: 'identity', type: 'score', direction: 'higher', max: 100, sourceKey: 'wbl', hint: '0–100, higher = more rights' },
  { key: 'religiousFreedom', label: 'Government restriction of religion', cluster: 'identity', type: 'score', direction: 'lower', max: 10, sourceKey: 'pew', hint: '0–10, lower = freer' },
  { key: 'raceProtection', label: 'Racial / ethnic discrimination protection', cluster: 'identity', type: 'status', direction: 'higher', scale: 'raceProtection', sourceKey: 'curated' },
  { key: 'disabilityRights', label: 'Disability rights', cluster: 'identity', type: 'status', direction: 'higher', scale: 'disabilityRights', sourceKey: 'crpd' },

  // ── Safety ───────────────────────────────────────────────────────────────
  { key: 'travelAdvisory', label: 'Travel advisory level', cluster: 'safety', type: 'score', direction: 'lower', max: 4, sourceKey: 'state', hint: 'US State Dept 1–4, lower = safer' },
  { key: 'safetyGeneral', label: 'General peace & safety', cluster: 'safety', type: 'score', direction: 'lower', max: 5, sourceKey: 'gpi', hint: 'Global Peace Index 1–5, lower = safer' },
  { key: 'womensSafety', label: "Women's safety in public", cluster: 'safety', type: 'score', direction: 'higher', max: 100, sourceKey: 'curated', hint: '0–100, higher = safer' },
  { key: 'accessibility', label: 'Accessibility of infrastructure', cluster: 'safety', type: 'score', direction: 'higher', max: 100, sourceKey: 'dare', hint: '0–100, higher = more accessible' },

  // ── Expression & digital ─────────────────────────────────────────────────
  { key: 'freeExpression', label: 'Freedom & civil liberties', cluster: 'expression', type: 'score', direction: 'higher', max: 100, sourceKey: 'freedomhouse', hint: '0–100, higher = freer' },
  { key: 'pressFreedom', label: 'Press freedom', cluster: 'expression', type: 'score', direction: 'higher', max: 100, sourceKey: 'rsf', hint: '0–100, higher = freer' },
  { key: 'internetFreedom', label: 'Internet freedom', cluster: 'expression', type: 'score', direction: 'higher', max: 100, sourceKey: 'fotn', hint: '0–100, higher = freer' },
  { key: 'surveillance', label: 'Surveillance, data privacy & app bans', cluster: 'expression', type: 'text', sourceKey: 'curated' },

  // ── Everyday life ────────────────────────────────────────────────────────
  { key: 'culturalNorms', label: 'Cultural & social norms', cluster: 'everyday', type: 'text', sourceKey: 'curated' },
  { key: 'dress', label: 'Dress & public conduct', cluster: 'everyday', type: 'text', sourceKey: 'curated' },
  { key: 'holidays', label: 'Holidays & observances', cluster: 'everyday', type: 'text', sourceKey: 'curated' },
  { key: 'workRights', label: 'Student work rights', cluster: 'everyday', type: 'text', sourceKey: 'curated' },
  { key: 'education', label: 'Education system note', cluster: 'everyday', type: 'text', sourceKey: 'curated' },
]

export const ASPECT_BY_KEY = Object.fromEntries(ASPECTS.map((a) => [a.key, a]))

export function aspectsForCluster(clusterId) {
  return ASPECTS.filter((a) => a.cluster === clusterId)
}

// Aspects that can be compared numerically (drive the "what changes" lens).
export const COMPARABLE_ASPECTS = ASPECTS.filter((a) => a.type !== 'text')
