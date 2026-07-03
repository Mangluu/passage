// Ordinal scales for categorical ("status") aspects.
// Each array is ordered from least → most free/protective; the index IS the
// ordinal stored in the country data. Keeping labels here (not in every country
// record) avoids repetition and keeps wording consistent.

export const SCALES = {
  abortion: [
    { label: 'Prohibited', tone: 'bad' },
    { label: 'Only to save life / health', tone: 'warn' },
    { label: 'Broad social & economic grounds', tone: 'ok' },
    { label: 'On request', tone: 'good' },
  ],
  genderCare: [
    { label: 'Not available / banned', tone: 'bad' },
    { label: 'Restricted', tone: 'warn' },
    { label: 'Available', tone: 'good' },
  ],
  cannabis: [
    { label: 'Illegal — severe penalties', tone: 'bad' },
    { label: 'Illegal', tone: 'warn' },
    { label: 'Medical use only', tone: 'warn' },
    { label: 'Decriminalised (personal)', tone: 'ok' },
    { label: 'Legal (recreational)', tone: 'good' },
  ],
  sameSex: [
    { label: 'Criminalised', tone: 'bad' },
    { label: 'Legal, no recognition', tone: 'warn' },
    { label: 'Civil unions / partnerships', tone: 'ok' },
    { label: 'Marriage equality', tone: 'good' },
  ],
  blasphemy: [
    { label: 'Enforced restrictions', tone: 'bad' },
    { label: 'Laws on the books', tone: 'warn' },
    { label: 'No such laws', tone: 'good' },
  ],
  raceProtection: [
    { label: 'Weak / no protection', tone: 'bad' },
    { label: 'Partial protection', tone: 'warn' },
    { label: 'Strong anti-discrimination law', tone: 'good' },
  ],
  disabilityRights: [
    { label: 'Limited protection', tone: 'bad' },
    { label: 'CRPD ratified; basic law', tone: 'warn' },
    { label: 'Strong rights & enforcement', tone: 'good' },
  ],
}

// Tailwind class bundles per tone — the single source of colour truth.
export const TONES = {
  bad: { badge: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30', bar: 'bg-red-500', dot: 'bg-red-500' },
  warn: { badge: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30', bar: 'bg-amber-500', dot: 'bg-amber-500' },
  ok: { badge: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30', bar: 'bg-sky-500', dot: 'bg-sky-500' },
  good: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30', bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  na: { badge: 'bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:ring-slate-600', bar: 'bg-slate-300 dark:bg-slate-600', dot: 'bg-slate-300' },
}

export function statusEntry(scaleName, ordinal) {
  const scale = SCALES[scaleName]
  if (!scale || ordinal == null || !scale[ordinal]) return null
  return scale[ordinal]
}

export function scaleMaxOrdinal(scaleName) {
  const scale = SCALES[scaleName]
  return scale ? scale.length - 1 : 1
}

// Map a normalised goodness (0 = worst, 1 = best) to a tone for score bars.
export function goodnessToTone(g) {
  if (g == null) return 'na'
  if (g < 0.34) return 'bad'
  if (g < 0.67) return 'warn'
  return 'good'
}
