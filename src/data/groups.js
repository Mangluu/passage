// Marginalised groups. Ticking a group does NOT hide anything — it lifts that
// group's most-relevant aspects to the top and highlights them, so the same
// dataset re-prioritises around who the student is.

export const GROUPS = [
  {
    id: 'women',
    label: 'Women',
    icon: 'Flower2',
    blurb: 'Reproductive rights, legal equality & safety in public.',
    accent: { text: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50', ring: 'ring-rose-300', solid: 'bg-rose-500', chip: 'bg-rose-500 text-white' },
    priorityAspects: ['abortion', 'womensRights', 'womensSafety', 'dress', 'healthcareAccess'],
  },
  {
    id: 'lgbtqi',
    label: 'LGBTQI+',
    icon: 'Rainbow',
    blurb: 'Legal recognition, gender-affirming care & expression.',
    accent: { text: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50', ring: 'ring-violet-300', solid: 'bg-violet-500', chip: 'bg-violet-500 text-white' },
    priorityAspects: ['lgbtEquality', 'sameSex', 'genderCare', 'blasphemy', 'freeExpression'],
  },
  {
    id: 'poc',
    label: 'Person of colour',
    icon: 'Globe2',
    blurb: 'Discrimination protection, policing & everyday climate.',
    accent: { text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50', ring: 'ring-amber-300', solid: 'bg-amber-500', chip: 'bg-amber-500 text-white' },
    priorityAspects: ['raceProtection', 'police', 'safetyGeneral', 'customs', 'culturalNorms'],
  },
  {
    id: 'religion',
    label: 'Religion / Faith',
    icon: 'Church',
    blurb: 'Freedom of worship, dress, food & observances.',
    accent: { text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50', ring: 'ring-teal-300', solid: 'bg-teal-500', chip: 'bg-teal-500 text-white' },
    priorityAspects: ['religiousFreedom', 'blasphemy', 'dress', 'holidays', 'culturalNorms'],
  },
  {
    id: 'disabled',
    label: 'Disabled people',
    icon: 'Accessibility',
    blurb: 'Rights, physical & digital accessibility, healthcare.',
    accent: { text: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50', ring: 'ring-sky-300', solid: 'bg-sky-500', chip: 'bg-sky-500 text-white' },
    priorityAspects: ['disabilityRights', 'accessibility', 'healthcareAccess', 'safetyGeneral', 'workRights'],
  },
]

export const GROUP_BY_ID = Object.fromEntries(GROUPS.map((g) => [g.id, g]))

// Set of aspect keys prioritised by ANY of the selected groups.
export function relevantAspectKeys(selectedIds) {
  const keys = new Set()
  for (const id of selectedIds) {
    const g = GROUP_BY_ID[id]
    if (g) g.priorityAspects.forEach((k) => keys.add(k))
  }
  return keys
}

// Groups (by id) that flagged a given aspect as a priority — used to tag cards.
export function groupsForAspect(aspectKey, selectedIds) {
  return selectedIds
    .map((id) => GROUP_BY_ID[id])
    .filter((g) => g && g.priorityAspects.includes(aspectKey))
}
