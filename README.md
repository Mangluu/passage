# Passage — Liberty & Security for Exchange Students

**B_Hack Baltic Sea Region Hackathon 2026 · Track: Liberty & Security · Group 6**

Passage is a **privacy-first** dashboard that shows exchange students how *liberty and
security change when they cross a border* — tailored to the marginalised group(s) they
belong to. Pick where you're from, where you're going, and who you are; Passage surfaces
**what's different for you**, from public, sourced data.

No accounts. No profiles. No tracking. Your choices live only in the page URL — nothing is
sent to a server or stored. Privacy by design.

## Highlights

- **Comparison lens** — the "What changes vs. home" panel diffs your origin against your
  destination and ranks the biggest differences (red = more restrictive there, green = freer).
- **Group-aware** — ticking Women / LGBTQI+ / Person of colour / Religion / Disabled
  re-prioritises and highlights the aspects that matter to that group (it never hides data).
- **28 aspects across 6 themes** — health & bodily autonomy, legal status & policing, identity
  rights, safety, expression & digital, and everyday life.
- **10 diverse countries** — USA, Brazil, Germany, Norway, Kenya, Egypt, South Africa, China,
  Australia, Uzbekistan (any can be origin *or* destination).
- **Every datapoint is cited** with its source and retrieval date; see the in-app Sources page.
- **Light & dark theme** — toggle in the header, remembered locally (theme preference only).

## Where the numbers come from

Legal facts (marriage equality, criminalisation, cannabis status, CRPD, abortion category) are set
by hand from primary law. Three numeric indices are refreshed from authoritative open data —
**LGBTQI+ legal equality** (Equaldex), **Women, Business & the Law** (World Bank) and **Freedom in
the World** (Freedom House), mirrored as clean CSVs by Our World in Data:

```bash
node scripts/refresh-data.mjs   # prints the latest value per country
```

This runs at build time only — the app ships those values statically, so there are **no runtime API
calls, no keys, and nothing that can break during a demo** (and it keeps the privacy-by-design
promise intact). The remaining scores (press/internet freedom, peace index, religious restriction,
women's safety, accessibility, travel advisory) are curated estimates, marked "≈" in the UI, and
should be verified against their linked source.

## Run it

```bash
npm install
npm run dev      # → http://localhost:5173
```

Build a static bundle (deployable to Netlify / Vercel / GitHub Pages — no backend):

```bash
npm run build
npm run preview
```

## Tech

React + Vite, Tailwind CSS, Recharts (radar), lucide-react (icons), flag-icons (flags),
react-router-dom (HashRouter, so refreshes work on any static host). No server, no database.

## Project layout

```
src/
  pages/        Home · Dashboard · Sources
  components/   DeltaStrip · AspectCard · ScoreBar · StatusBadge · ClusterRadar · …
  data/         aspects.js (schema) · groups.js (group→aspect map) · sources.js · countries.js
  lib/          compare.js (delta engine) · scales.js (ordinal scales) · format.js
```

To add a country, add one record to `src/data/countries.js` using the same aspect keys.
To add an aspect, add it to `src/data/aspects.js` (and a scale in `src/lib/scales.js` if
it's categorical), then fill the value for each country.

## Important disclaimer

Passage is an **informational prototype**. Laws and indices are simplified and may be out of
date; numeric scores marked "≈" are approximate and should be verified against the linked
source. **Laws differ from lived experience, and this is not legal advice.** Always confirm
with official government channels and your host institution before you travel.

Built with only publicly available data and openly-licensed assets (no copyrighted material).
