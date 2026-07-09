// The topic catalog. Two kinds of topic:
//   • position   — a comparable legal state on an ordered scale (index 0 = least
//                  free … last = most free). Drives the "what changes" deltas.
//   • obligation — a duty the destination places on you. Drives the checklist;
//                  surfaced as a "new duty" when the destination requires it.
//
// `crime` marks the scale index at/below which the state is criminalised /
// enforced / prohibited — a destination in that state (worse than home) is
// always Critical. `audiences` is who a topic weighs most for.

export const CLUSTERS = [
  { id: 'identity', label: 'Identity & recognition' },
  { id: 'body', label: 'Body & health' },
  { id: 'belief', label: 'Faith & conscience' },
  { id: 'expression', label: 'Speech & press' },
  { id: 'duties', label: 'Your obligations on arrival' },
]

export const TOPICS = [
  {
    key: 'same_sex', label: 'Same-sex relationships', cluster: 'identity',
    kind: 'position', audiences: ['lgbtqi'], weight: 3, crime: 0,
    scale: ['Criminalised', 'Legal, no recognition', 'Civil unions', 'Marriage equality'],
  },
  {
    key: 'gender_recognition', label: 'Legal gender recognition', cluster: 'identity',
    kind: 'position', audiences: ['lgbtqi'], weight: 2,
    scale: ['Not possible', 'Medically gatekept', 'Self-determination'],
  },
  {
    key: 'antidiscrimination', label: 'Anti-discrimination protection', cluster: 'identity',
    kind: 'position', audiences: ['lgbtqi', 'poc', 'religion', 'disabled', 'women'], weight: 2,
    scale: ['No general protection', 'Partial protection', 'Broad protection'],
  },
  {
    key: 'disability_rights', label: 'Disability rights', cluster: 'identity',
    kind: 'position', audiences: ['disabled'], weight: 2,
    scale: ['Limited', 'CRPD ratified + basic law', 'Strong rights'],
  },
  {
    key: 'womens_rights', label: "Women's legal rights", cluster: 'identity',
    kind: 'position', audiences: ['women'], weight: 3,
    scale: ['Severe legal inequality', 'Major legal gaps', 'Mostly equal in law', 'Broadly equal in law'],
  },
  {
    key: 'lgbtqi_rights', label: 'LGBTQ+ legal equality', cluster: 'identity',
    kind: 'position', audiences: ['lgbtqi'], weight: 3,
    scale: ['Hostile — few or no protections', 'Restrictive', 'Partial protections', 'Broadly equal'],
  },
  {
    key: 'abortion', label: 'Abortion access', cluster: 'body',
    kind: 'position', audiences: ['women'], weight: 3, crime: 0,
    scale: ['Prohibited', 'To save life only', 'Broad social grounds', 'On request'],
  },
  {
    key: 'cannabis', label: 'Cannabis & personal drug law', cluster: 'body',
    kind: 'position', audiences: [], weight: 2, crime: 0,
    scale: ['Illegal — severe penalties', 'Illegal', 'Decriminalised', 'Legal'],
  },
  {
    key: 'religious_freedom', label: 'Government restriction of religion', cluster: 'belief',
    kind: 'position', audiences: ['religion'], weight: 2,
    scale: ['Very high restrictions', 'High restrictions', 'Moderate restrictions', 'Low restrictions'],
  },
  {
    key: 'blasphemy', label: 'Blasphemy & apostasy law', cluster: 'belief',
    kind: 'position', audiences: ['religion', 'lgbtqi'], weight: 2, crime: 0,
    scale: ['Actively enforced', 'On the books', 'No such laws'],
  },
  {
    key: 'expression', label: 'Freedom of expression', cluster: 'expression',
    kind: 'position', audiences: [], weight: 2,
    scale: ['Not free', 'Partly free', 'Free'],
  },
  {
    key: 'residence_registration', label: 'Address / residence registration', cluster: 'duties',
    kind: 'obligation', audiences: [], weight: 2,
  },
  {
    key: 'student_work', label: 'Student work rights', cluster: 'duties',
    kind: 'obligation', audiences: [], weight: 1,
  },
  {
    key: 'health_insurance', label: 'Health insurance', cluster: 'duties',
    kind: 'obligation', audiences: ['disabled'], weight: 1,
  },
  {
    key: 'medication_import', label: 'Bringing medication', cluster: 'duties',
    kind: 'obligation', audiences: ['disabled'], weight: 1,
  },
]

export const TOPIC_BY_KEY = Object.fromEntries(TOPICS.map((t) => [t.key, t]))
export const POSITION_TOPICS = TOPICS.filter((t) => t.kind === 'position')
export const OBLIGATION_TOPICS = TOPICS.filter((t) => t.kind === 'obligation')

export function topicsForCluster(clusterId) {
  return TOPICS.filter((t) => t.cluster === clusterId)
}
