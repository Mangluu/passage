// The reader. Selecting audiences re-weights and re-orders the briefing toward
// the facts most consequential for that person. It never hides anything.
export const AUDIENCES = [
  { id: 'women', label: 'Woman', blurb: 'Reproductive rights, legal standing, safety' },
  { id: 'lgbtqi', label: 'LGBTQI+', blurb: 'Recognition, criminalisation, expression' },
  { id: 'poc', label: 'Person of colour', blurb: 'Discrimination protection, policing' },
  { id: 'religion', label: 'Religious minority', blurb: 'Worship, blasphemy law, dress' },
  { id: 'disabled', label: 'Disabled', blurb: 'Rights, access, healthcare' },
]

export const AUDIENCE_BY_ID = Object.fromEntries(AUDIENCES.map((a) => [a.id, a]))
