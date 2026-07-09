// Partner / affiliate config for the "Before you go" slot on country pages.
//
// To go live with affiliate revenue, edit ONLY this file — no component changes:
//   1. set each partner's `ref` to your tracking suffix (e.g. '?referenceID=abc'
//      or '?ref=abc'); it is appended to `url`.
//   2. set AFFILIATE_DISCLOSURE to a short honest disclosure string.
// With no `ref`, the pages link to the plain product URL and claim no
// commission — honest by default until accounts exist.

export const PARTNERS = [
  {
    id: 'insurance',
    label: 'Travel insurance',
    url: 'https://safetywing.com/nomad-insurance',
    ref: '',
  },
  {
    id: 'esim',
    label: 'Get an eSIM',
    url: 'https://www.airalo.com/',
    ref: '',
  },
]

// Shown under the partner links only when set (i.e. once real affiliate links
// are live). FTC/ASA-style disclosure, e.g.:
// 'Some links are affiliate links — we may earn a commission at no cost to you.'
export const AFFILIATE_DISCLOSURE = ''

// True once any partner carries a ref — used to mark links rel="sponsored".
export const HAS_AFFILIATE = PARTNERS.some((p) => p.ref)
