// Presentation helpers for claims (labels + tones). Colour tones map to the
// semantic role classes defined in tailwind.config.js / index.css.

export const EVIDENCE_LABEL = {
  law: 'Law',
  index: 'Published index',
  practice: 'Reported practice',
  advisory: 'Official advisory',
  peer: 'Peer-reported',
}

export const CERTAINTY = {
  established: { label: 'Established', tone: 'success' },
  limited: { label: 'Limited data', tone: 'warn' },
  anecdote: { label: 'Anecdotal', tone: 'ink3' },
}

export const TIER = {
  critical: { label: 'Critical', tone: 'danger' },
  notable: { label: 'Notable', tone: 'warn' },
  minor: { label: 'Minor', tone: 'ink2' },
}

// Text-colour class for a direction (restrictive = red, freer = green).
export function directionTone(direction) {
  if (direction === 'restrictive') return 'danger'
  if (direction === 'freer') return 'success'
  return 'ink2'
}

export function yearOf(asOf) {
  return asOf ? String(asOf).slice(0, 4) : ''
}
