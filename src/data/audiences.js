// The reader. Selecting audiences re-weights and re-orders the briefing toward
// the facts most consequential for that person. It never hides anything.
// Order = build priority (the startup roadmap): Women first, then LGBTQI+,
// Disabled, Religious minority, Person of colour. Trans is inside LGBTQI+ — no
// separate lens; its distinct concerns (gender recognition, ID/medication at the
// border) surface within that briefing. Person of colour is intentionally last:
// its risk data is the hardest to source to the sourced-or-nothing bar.
export const AUDIENCES = [
  { id: 'women', label: 'Woman', blurb: 'Reproductive rights, legal standing, safety' },
  { id: 'lgbtqi', label: 'LGBTQI+', blurb: 'Recognition, criminalisation, expression' },
  { id: 'disabled', label: 'Disabled', blurb: 'Rights, access, healthcare' },
  { id: 'religion', label: 'Religious minority', blurb: 'Worship, blasphemy law, dress' },
  { id: 'poc', label: 'Person of colour', blurb: 'Discrimination protection, policing' },
]

export const AUDIENCE_BY_ID = Object.fromEntries(AUDIENCES.map((a) => [a.id, a]))
