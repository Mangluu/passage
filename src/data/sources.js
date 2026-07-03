// Source registry. Every aspect points here via its `sourceKey`, so each card
// on the dashboard can link to where its data comes from and when it was pulled.
// `retrieved` is the date the value was last checked against the source.

export const SOURCES = {
  crr: {
    name: "World's Abortion Laws Map",
    org: 'Center for Reproductive Rights',
    url: 'https://reproductiverights.org/maps/world-abortion-laws/',
    retrieved: '2026-07-03',
    license: 'Public interactive map',
  },
  who: {
    name: 'Country health information & entry requirements',
    org: 'WHO & national health authorities',
    url: 'https://www.who.int/countries',
    retrieved: '2026-07-03',
    license: 'Public',
  },
  equaldex: {
    name: 'LGBT Equality Index',
    org: 'Equaldex',
    url: 'https://www.equaldex.com/equality-index',
    retrieved: '2026-07-03',
    license: 'Free API / public database',
  },
  cannabis: {
    name: 'Legality of cannabis (by country)',
    org: 'Wikipedia + national statutes',
    url: 'https://en.wikipedia.org/wiki/Legality_of_cannabis',
    retrieved: '2026-07-03',
    license: 'CC BY-SA; cross-checked with national law',
  },
  pew: {
    name: 'Global Restrictions on Religion (Government Restrictions Index)',
    org: 'Pew Research Center',
    url: 'https://www.pewresearch.org/religion-datasets/',
    retrieved: '2026-07-03',
    license: 'Public dataset (free account)',
  },
  wbl: {
    name: 'Women, Business and the Law — Index score',
    org: 'World Bank',
    url: 'https://wbl.worldbank.org/en/wbl-data',
    retrieved: '2026-07-03',
    license: 'CC BY 4.0',
  },
  crpd: {
    name: 'Convention on the Rights of Persons with Disabilities — ratifications',
    org: 'United Nations',
    url: 'https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4',
    retrieved: '2026-07-03',
    license: 'Public',
  },
  state: {
    name: 'Travel Advisories (Level 1–4)',
    org: 'U.S. Department of State',
    url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html',
    retrieved: '2026-07-03',
    license: 'Public (U.S. Government work)',
  },
  gpi: {
    name: 'Global Peace Index',
    org: 'Institute for Economics & Peace',
    url: 'https://www.visionofhumanity.org/maps/',
    retrieved: '2026-07-03',
    license: 'Public map / report',
  },
  dare: {
    name: 'Digital Accessibility Rights Evaluation (DARE) Index',
    org: 'G3ict',
    url: 'https://g3ict.org/digital-accessibility-rights-evaluation-index/',
    retrieved: '2026-07-03',
    license: 'Public',
  },
  freedomhouse: {
    name: 'Freedom in the World — aggregate score',
    org: 'Freedom House',
    url: 'https://freedomhouse.org/countries/freedom-world/scores',
    retrieved: '2026-07-03',
    license: 'Free for non-commercial/academic use — cited',
  },
  rsf: {
    name: 'World Press Freedom Index',
    org: 'Reporters Without Borders (RSF)',
    url: 'https://rsf.org/en/index',
    retrieved: '2026-07-03',
    license: 'Public',
  },
  fotn: {
    name: 'Freedom on the Net',
    org: 'Freedom House',
    url: 'https://freedomhouse.org/countries/freedom-net/scores',
    retrieved: '2026-07-03',
    license: 'Free for non-commercial/academic use — cited',
  },
  curated: {
    name: 'Curated from public reports',
    org: 'Passage team',
    url: 'https://github.com/',
    retrieved: '2026-07-03',
    license: 'Compiled from public government & NGO reporting — see Sources page',
  },
}

export function sourceFor(key) {
  return SOURCES[key] || SOURCES.curated
}
