import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '../dist-ssr/entry-server.js'
import { JURISDICTIONS } from '../src/data/jurisdictions.js'
import { profileFor, verdictLine } from '../src/lib/profile.js'

// Post-build static site generation. `vite build` produces the client bundle in
// dist/; `vite build --ssr` produces dist-ssr/entry-server.js. This walks the
// crawlable routes, renders each to static HTML with its own <title>/meta, and
// writes one dist/<route>/index.html per URL (200-status, real content). Hooked
// into `npm run build`, so CI deploys the prerendered output with no extra step.

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..')
const DIST = path.join(ROOT, 'dist')
const BASE = '/passage' // GitHub Pages project path
const ORIGIN = 'https://mangluu.github.io'
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const clip = (s, n = 155) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s)
const canonical = (appPath) => `${ORIGIN}${BASE}${appPath === '' ? '/' : appPath + '/'}`

const BUILD_DATE = new Date().toISOString().slice(0, 10)
const ORG = { '@type': 'Organization', name: 'Passage', url: `${ORIGIN}${BASE}/` }

// schema.org JSON-LD so search engines understand each page as a dated,
// sourced article (and the site as a whole). No new data — derived from the
// page's own title/description/url.
function jsonLd(appPath, title, description, url) {
  const headline = title.replace(' — Passage', '')
  if (appPath.startsWith('/safe/')) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      url,
      inLanguage: 'en',
      datePublished: '2026-07-08',
      dateModified: BUILD_DATE,
      author: ORG,
      publisher: ORG,
      isAccessibleForFree: true,
    }
  }
  if (appPath === '') {
    return { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Passage', url, description, publisher: ORG }
  }
  return { '@context': 'https://schema.org', '@type': 'WebPage', name: headline, description, url, publisher: ORG }
}

function buildHtml(appPath, { title, description, content = '' }) {
  const url = canonical(appPath)
  const head =
    `<link rel="canonical" href="${esc(url)}" />\n` +
    `    <meta property="og:type" content="website" />\n` +
    `    <meta property="og:title" content="${esc(title)}" />\n` +
    `    <meta property="og:description" content="${esc(description)}" />\n` +
    `    <meta property="og:url" content="${esc(url)}" />\n` +
    `    <meta name="twitter:card" content="summary" />\n` +
    `    <script type="application/ld+json">${JSON.stringify(jsonLd(appPath, title, description, url))}</script>`

  let out = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  out = /<meta\s+name="description"[\s\S]*?>/.test(out)
    ? out.replace(/<meta\s+name="description"[\s\S]*?>/, `<meta name="description" content="${esc(description)}" />`)
    : out.replace('</head>', `  <meta name="description" content="${esc(description)}" />\n  </head>`)
  out = out.replace('</head>', `    ${head}\n  </head>`)
  out = out.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  return out
}

function ssr(appPath) {
  try {
    return render(`${BASE}${appPath === '' ? '/' : appPath}`)
  } catch (e) {
    console.warn('  ! SSR fallback (client-only) for', appPath || '/', '—', e.message)
    return ''
  }
}

const written = []
function emit(appPath, meta, { sitemap = true } = {}) {
  const content = ssr(appPath)
  const dir = appPath === '' ? DIST : path.join(DIST, appPath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), buildHtml(appPath, { ...meta, content }))
  if (sitemap) written.push(canonical(appPath))
}

// ── Static pages ─────────────────────────────────────────────────────────────
emit('', {
  title: 'Passage — Safety & rights, before you go',
  description: 'Honest, sourced briefings on how safe and free you’ll be abroad — read for who you are. No account, no tracking, nothing stored.',
})
emit('/explore', {
  title: 'Every country, indexed — Passage',
  description: 'Published safety, rights and health indices for every country, each dated and linked to its source. Honest by construction.',
})
emit('/sources', {
  title: 'Method & sources — Passage',
  description: 'How Passage is built: every claim carries its evidence type, a date, and a named public source.',
})
emit('/privacy', {
  title: 'Privacy — Passage',
  description: 'Passage keeps no account, runs no trackers, and stores nothing about you.',
})
emit('/impressum', {
  title: 'About — Passage',
  description: 'Passage is a privacy-first, sourced safety & rights briefing for travellers.',
})

// ── Identity verticals: one page per country per deepened lens ────────────────
const VERTICALS = [
  { aud: 'women', phrase: 'women travellers', tail: 'abortion access, legal standing, mobility and emergencies' },
  { aud: 'lgbtqi', phrase: 'LGBTQ+ travellers', tail: 'legal status, recognition, anti-discrimination and emergencies' },
  { aud: 'disabled', phrase: 'disabled travellers', tail: 'disability rights, anti-discrimination, bringing medication and emergencies' },
]
const vcount = {}
for (const v of VERTICALS) {
  vcount[v.aud] = 0
  for (const j of JURISDICTIONS) {
    const prof = profileFor(j, v.aud)
    const verdict = verdictLine(j, v.phrase, prof)
    emit(`/safe/${j.code}/${v.aud}`, {
      title: `Is ${j.name} safe for ${v.phrase}? — Passage`,
      description: clip(`${verdict} Sourced, dated facts on ${v.tail}.`),
    })
    vcount[v.aud]++
  }
}

// ── Tool shell (client-only; not a search target) ───────────────────────────
emit('/briefing', {
  title: 'Compare two countries — Passage',
  description: 'See exactly how your rights, safety and health change between two countries.',
}, { sitemap: false })

// ── SPA fallback for any non-prerendered deep link ───────────────────────────
fs.writeFileSync(
  path.join(DIST, '404.html'),
  buildHtml('', { title: 'Passage — Safety & rights, before you go', description: 'Safety & rights briefings for travellers.', content: '' }),
)

// ── sitemap + robots ─────────────────────────────────────────────────────────
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
  `\n</urlset>\n`
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}${BASE}/sitemap.xml\n`)

console.log(`✓ prerendered ${written.length} pages (${Object.entries(vcount).map(([a, n]) => `${n} ${a}`).join(', ')}) + 404 + sitemap + robots`)
