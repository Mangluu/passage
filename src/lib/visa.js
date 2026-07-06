// Read layer over src/data/visa.json — entry requirement for a home passport into
// a destination. The one genuinely pairwise fact in the app. Encoding: a number
// is visa-free days; letters are the categorical cases.
import raw from '../data/visa.json'

export const VISA_GENERATED_AT = raw.generatedAt
export const VISA_SOURCE = raw.source

const CAT = {
  vf: { label: 'Visa-free', tone: 'success' },
  voa: { label: 'Visa on arrival', tone: 'warn' },
  evisa: { label: 'eVisa / eTA', tone: 'warn' },
  req: { label: 'Visa required', tone: 'danger' },
  no: { label: 'Entry restricted', tone: 'danger' },
}

export function visaFor(originCode, destCode) {
  if (!originCode || !destCode || originCode === destCode) return null
  const v = raw.matrix?.[originCode]?.[destCode]
  if (v == null) return null
  if (typeof v === 'number') return { label: 'Visa-free', detail: `${v} days`, tone: 'success' }
  const c = CAT[v] || CAT.req
  return { label: c.label, detail: null, tone: c.tone }
}
