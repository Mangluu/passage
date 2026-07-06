import { TOPICS } from '../data/topics.js'
import { signalsFor } from './signals.js'

// Keyword → topic. Deterministic retrieval: we map a question onto our verified
// topics and answer ONLY from real claims. No generation, so no hallucination.
const TOPIC_KEYWORDS = {
  same_sex: ['same-sex', 'same sex', 'gay', 'lesbian', 'homosexual', 'marriage', 'partner', 'sodomy', 'criminalis', 'lgbt', 'queer'],
  gender_recognition: ['trans', 'transgender', 'gender recognition', 'gender marker', 'legal gender', 'change gender', 'nonbinary', 'non-binary', 'hormone'],
  antidiscrimination: ['discriminat', 'protected', 'equal treatment', 'equality law', 'racism', 'racist', 'hate crime'],
  disability_rights: ['disab', 'wheelchair', 'accessib', 'crpd'],
  abortion: ['abortion', 'reproductive', 'terminate', 'pregnancy', 'contracept'],
  cannabis: ['cannabis', 'weed', 'marijuana', 'drug', 'joint'],
  religious_freedom: ['religio', 'worship', 'faith', 'pray', 'mosque', 'church', 'hijab', 'muslim', 'islam'],
  blasphemy: ['blasphemy', 'apostasy', 'insult relig', 'convert', 'proselyt'],
  expression: ['speech', 'expression', 'protest', 'press', 'censor', 'post online', 'criticis', 'activis', 'social media'],
  residence_registration: ['register', 'registration', 'anmeldung', 'address', 'residence permit', 'visa'],
  student_work: ['work', 'job', 'employ', 'part-time', 'internship'],
  health_insurance: ['insurance', 'health cover', 'healthcare'],
  medication_import: ['medication', 'medicine', 'prescription', 'pills', 'bring my meds'],
}

const SAFETY_INTENT = /\b(safe|safety|danger|dangerous|risk|risky|ok|okay|allowed|legal|illegal|arrest|prison|attack|welcom|accept|out|visible|hold hands)/i

export function ask({ question, origin, dest, audiences = [] }) {
  const q = (question || '').toLowerCase()

  const direct = TOPICS.filter((t) => (TOPIC_KEYWORDS[t.key] || []).some((k) => q.includes(k))).map((t) => t.key)

  // A broad safety/identity question ("is it safe to be visibly me?") should pull
  // ALL of the reader's relevant topics — not just the one keyword it hit. A
  // question with no topic match and no safety intent is genuinely out of scope.
  let keys = direct
  if (SAFETY_INTENT.test(q)) {
    const relevant = TOPICS.filter((t) =>
      audiences.length ? t.audiences.some((a) => audiences.includes(a)) : t.kind === 'position',
    ).map((t) => t.key)
    keys = [...new Set([...direct, ...relevant])]
  }
  keys = keys.slice(0, 6)

  const items = keys
    .map((k) => {
      const claim = dest.claims[k]
      if (!claim) return null
      const topic = TOPICS.find((t) => t.key === k)
      const from = origin.claims[k]
      return { key: k, topic, claim, fromShort: from && from.short, toShort: claim.short }
    })
    .filter(Boolean)

  const { news } = signalsFor(dest.code, audiences)
  const signals = news.slice(0, 3)

  return {
    items,
    signals,
    refusal: items.length
      ? null
      : `I only answer from Liberty Compass's verified graph, and I don't have a verified claim matching that. Try a topic like same-sex relationships, abortion, cannabis, religious freedom, or address registration — or check your embassy for anything we don't cover.`,
  }
}
