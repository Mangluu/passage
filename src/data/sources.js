// Source registry. A claim's `src` is either a key into this table (for the
// global datasets we reuse) or an inline { org, url } object (for a
// country-specific official source). resolveSource() handles both.

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
