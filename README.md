# Passage — sourced safety & rights briefings, read for who you are

*How safe and free will you actually be abroad — specific to who you are, every fact sourced and dated.*

**Live: https://mangluu.github.io/passage/**

Anyone can ask an LLM *"is X safe for someone like me?"* and get a confident, fluent, personalised — and
sometimes **wrong** — answer. For a decision where being wrong means detained, denied medication, or worse,
fluency isn't enough. Passage is the opposite bet: **every claim carries its evidence type, the date it
reflects, its source, and how sure we are — and it says when it doesn't know.** Provenance over plausibility.

Two ways in:

- **Country × identity pages** — *"Is Japan safe for LGBTQ+ travellers?"* (`/safe/<code>/<identity>`): a
  grounded verdict, the sourced facts that weigh most for you (concerns first), the full record, entry &
  emergency info. Prerendered as real static pages, one per country per identity.
- **Compare with home** — pick origin + destination + who you are; Passage ranks *what changes for you* by
  severity (anything the destination criminalises/enforces that's relevant to you is Critical), flags new
  duties on arrival (address registration, insurance mandates) as a checklist, and surfaces cross-cutting
  risks a search wouldn't volunteer (e.g. the return trip: cannabis legal there is still a felony at home).

## The honesty bar (the whole point)

Passage is only worth using if it's more trustworthy than a guess. The rules the whole codebase follows:

- **Every claim links to a source** and shows its evidence type (Law / Published index / Reported practice /
  Advisory), the year it reflects, and a certainty label — **`established`** (grounded in an authoritative
  dataset or cross-checked primary source) vs **`limited`** (a reasonable band, not individually verified).
- **Refuse, don't invent.** No source for a country/topic → the field is blank ("no data"), never guessed.
  An earlier version had 0–100 "safety scores"; several were invented, so they were deleted in favour of the
  claims spine.
- **Ask Passage** answers by *retrieval only* over the verified claims — it cites every one and refuses when
  it has nothing verified, so it can't hallucinate.

Four identity lenses are each anchored to a real, current, machine-readable dataset, and only claims that
clear the bar are promoted to `established`:

| Lens | Anchor dataset |
|------|----------------|
| **Women** | World Bank — Women, Business and the Law |
| **LGBTQ+** | Equaldex — LGBT Legal Equality Index |
| **Disabled** | UN CRPD ratification (UN Treaty Collection) |
| **Religion** | Pew — Government Restrictions Index |

Abortion access (UN DESA), same-sex law, blasphemy, anti-discrimination, entry rules and emergency numbers
round out the spine. **Person of colour** is deliberately *not* shipped: there is no credible per-country
dataset for it, and a page built on a proxy would break the bar that makes the other four trustworthy.

## Privacy by design

- No account, no profile, no cookies, no analytics, no tracking of any kind. We never ask who you are.
- Your selections live **only in the page URL**, in your browser — never sent to a server. Pages are static.
- **Fonts are self-hosted** — the page makes no third-party requests. Hosting is GitHub Pages (logs IP at the
  server level, disclosed on the in-app **Privacy** page).

## How it's built

Static React + Vite site, **no backend, no database**. Data is derived at build time from keyless public
datasets and bundled into the page, so nothing is fetched in the user's browser.

```
src/
  data/
    jurisdictions.js  # the claims spine — 196 sovereign countries × sourced, dated claims
    topics.js         # topic catalog: position topics (ordered scale) + obligations (duties)
    audiences.js      # the five identity lenses → which topics weigh for each
    sources.js        # source registry (+ inline per-claim official sources)
    partners.js       # affiliate/partner config for the "Before you go" slot (empty until accounts exist)
    world.json        # GENERATED — every country × 9 published indices in 4 domains (Explore tier)
    signals.json / visa.json / emergency.json / cityPhotos.json   # GENERATED (see scripts/)
  lib/
    brief.js          # assembles the home→destination briefing (ranked changes, checklist, facts)
    profile.js        # single-country/identity read + grounded verdict (powers /safe pages)
    dashboard.js world.js signals.js visa.js emergency.js ask.js useTheme.js
  pages/              # Home · Briefing · Explore · SafeFor (/safe/:code/:aud) · Sources · Privacy · About
  entry-server.jsx    # SSR entry — renders a route to static HTML at build time
scripts/prerender.mjs # after build: writes one static HTML file per route (+ sitemap, robots, 404)
```

**SEO / prerender:** `npm run build` runs the client build, an SSR build, then `scripts/prerender.mjs`, which
emits a static `index.html` per route (own `<title>`/meta/canonical + JSON-LD), a `sitemap.xml`, and a
`404.html` SPA fallback. Routing is `BrowserRouter` with base `/passage/`; the client mounts with
`createRoot`, cleanly replacing the prerendered markup. So each country × identity page is a real, crawlable
URL — and the same sourced data an LLM should be citing.

## Run it

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # client + SSR + prerender → static bundle in dist/ (deploys via GitHub Pages)
```

## Contributing — help wanted

The most valuable contribution is **verified, sourced data**. Good first issues:

- **Promote a `limited` claim to `established`** — find a claim marked `cert: 'limited'` in
  `jurisdictions.js`, verify it against a primary/official source, and update the statement + `src` + `asOf`.
  (`religious_freedom` is `limited` for ~148 countries pending the full Pew GRI — a great target.)
- **Add a claim for a specific country** using the existing topic keys. Never invent a law name or date; if
  unsure, leave it `limited` or omit it.
- **Add a data vertical** — the pattern (`src/data/topics.js` + a Node script that bands a keyless dataset
  into per-country claims) is how the four lenses were built. See `scripts/` and the commit history.
- **Fix or extend the generated data** — `scripts/fetch-*.mjs` rebuild `world.json` / `signals.json` /
  `visa.json` / `emergency.json` from public sources (OWID, Passport Index, Emergency Number API). Keyless.

**One rule above all: cite everything, and be honest about certainty.** A `limited` label is fine; a
confident wrong `established` claim is the one thing that breaks the product.

On the roadmap (say hi if you want to take one): a **freshness / change-tracking** layer (what changed, and
when), an **MCP / API** so AI assistants can ground on Passage's sourced claims, and **institutional pilots**
(study-abroad offices, NGOs) that need auditable, current safety data.

## Disclaimer

Passage is an **informational project**. Laws and indices are simplified and can be out of date; every claim
shows its evidence type and certainty. **Laws differ from lived experience, and this is not legal advice.**
Always confirm with official government channels before you travel. Built with only publicly available data
and openly-licensed or original assets.
