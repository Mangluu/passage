// Source registry. A claim's `src` is either a key into this table (for the
// global datasets we reuse) or an inline { org, url } object (for a
// country-specific official source). resolveSource() handles both.
import { JURISDICTIONS } from './jurisdictions.js'

export const SOURCES = {
  equaldex: { org: 'Equaldex', name: 'LGBT rights by country', url: 'https://www.equaldex.com/' },
  ilga: { org: 'ILGA World', name: 'State-Sponsored Homophobia / laws map', url: 'https://ilga.org/maps-sexual-orientation-laws/' },
  crr: { org: 'Center for Reproductive Rights', name: "The World's Abortion Laws", url: 'https://reproductiverights.org/maps/world-abortion-laws/' },
  pew: { org: 'Pew Research Center', name: 'Government Restrictions on Religion Index', url: 'https://www.pewresearch.org/religion/religious-restrictions/' },
  freedomhouse: { org: 'Freedom House', name: 'Freedom in the World', url: 'https://freedomhouse.org/countries/freedom-world/scores' },
  uncrpd: { org: 'United Nations', name: 'CRPD ratification status', url: 'https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4' },
  forb: { org: 'Humanists International', name: 'Freedom of Thought Report', url: 'https://fot.humanists.international/' },
}

export function resolveSource(src) {
  if (!src) return { org: 'Uncited', url: '' }
  if (typeof src === 'string') return SOURCES[src] || { org: src, url: '' }
  return src
}

// Every source actually used anywhere — the shared registry PLUS the inline
// per-claim sources — deduplicated. Powers the complete list on the Sources
// page so nothing is cited that isn't listed.
export function allUsedSources() {
  const seen = new Map()
  const add = (src) => {
    const r = resolveSource(src)
    if (!r || (!r.url && !r.org)) return
    const key = `${r.url || ''}|${r.org || ''}`
    if (!seen.has(key)) seen.set(key, r)
  }
  Object.values(SOURCES).forEach(add)
  for (const j of JURISDICTIONS) {
    for (const claim of Object.values(j.claims || {})) {
      if (claim && claim.src) add(claim.src)
    }
  }
  return [...seen.values()].sort((a, b) => (a.org || '').localeCompare(b.org || ''))
}
