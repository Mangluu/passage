# Liberty Compass — pre-departure briefings for exchange students

**B_Hack Baltic Sea Region Hackathon 2026 · Track: Liberty & Security · Group 6**

Live: **https://mangluu.github.io/passage/**

Liberty Compass turns *"how do liberty and security differ between home and my destination?"* into a
**sourced, dated briefing** — specific to who you are. Not a country score card. Every fact is a
claim that carries its evidence type, the date it reflects, its source, and how sure we are.

Pick your home country, your destination, and (optionally) the group(s) you belong to
(Woman · LGBTQI+ · Person of colour · Religious minority · Disabled). Liberty Compass assembles a
briefing that:

- **Ranks what changes for you** by severity — anything the destination criminalises, enforces or
  prohibits that's relevant to you is Critical; new legal duties with short deadlines are Notable.
- **Surfaces cross-cutting risks** a search wouldn't volunteer — e.g. *the return trip*: cannabis
  legal at your destination is still a felony under your home law when you go back.
- **Flags new duties on arrival** — address registration (Germany's 14-day Anmeldung, China's
  24-hour police registration), work-hour rules, insurance mandates — and turns them into a checklist.
- **Shows every claim's provenance** — Law / Published index / Reported practice / Advisory, dated,
  linked, with an Established / Limited-data / Anecdotal certainty label. **Every claim links to a
  source.**

## Privacy by design

The "we store nothing" property is a feature, and it's on-theme for the track.

- No account, no profile, no cookies, no analytics, no tracking of any kind.
- Your home/destination/prioritised-topics live **only in the page URL**, in your browser — never
  sent to a server. The briefing is assembled client-side.
- **Fonts are self-hosted** — the page makes **no third-party requests at all** (no Google Fonts,
  no CDNs). The only request is to the host to fetch the site.
- Hosting is GitHub Pages, which logs IP at the server level — disclosed honestly on the in-app
  **Privacy** page, alongside an **Impressum** (§ 5 DDG / § 18 MStV).
- Light & dark theme (a purple/cyan palette); the theme preference is the only thing kept locally.
  The briefing also prints as a clean document.

## Why claims, not scores

An earlier version showed 0–100 "safety scores". They looked authoritative but several were
invented — fatal for a trust product. That was deleted in favour of a spine of **claims**: plain
statements grounded in law and published indices, each verifiable at its source. The legal facts
were cross-checked in an **adversarial verification pass** (multi-agent web research that tries to
prove each claim wrong against primary/official sources).

The dashboard's per-area "how protected" scores use a **real published index where one exists**
(freedom of expression → Freedom House; government restriction of religion → Pew) and an indicative
8–92 band for the categorical facts, so a single bucket never collapses an area to a bare 0 or 100.
Hover any score to see exactly which facts and values produced it.

## Structure

```
src/
  data/
    jurisdictions.js   # the claims spine — 10 countries × sourced, dated claims
    topics.js          # catalog: position topics (comparable states) + obligations (duties)
    audiences.js       # reader groups → which topics weigh most
    sources.js         # source registry (+ inline per-claim official sources)
  lib/
    severity.js        # pure severity model (critical / notable / minor)
    brief.js           # assembles the briefing: ranked changes, insights, checklist, facts
    dashboard.js       # area scores (published indices + band), advisories, verdict
    useTheme.js        # shared light/dark store
  components/           # Header · Sidebar · Footer · Logo · CountrySelect · AudienceSelect
                        # CityHeader (image carousel) · ScoreRows · OverallScale
                        # FactCard · ClaimMeta · Checklist · Tag
  pages/                # Home · Briefing · Sources · Privacy · Impressum
  assets/
    fonts/              # self-hosted woff2 (Newsreader · IBM Plex Sans · IBM Plex Mono)
    cities/<code>/*.jpg # per-country hero images for the carousel
```

- **Add a country**: one record in `jurisdictions.js` using the same topic keys.
- **Add a topic**: add it to `topics.js` (with its ordered `scale` for a position topic), then add
  the claim to each jurisdiction.

## Scripts

```bash
node scripts/refresh-data.mjs    # refresh published indices (Equaldex · World Bank · Freedom House)
node scripts/fetch-fonts.mjs     # re-download & self-host the web fonts into src/assets/fonts
node scripts/build-cities.mjs    # optimise destination images into src/assets/cities/<code>/
```

`build-cities.mjs` reads the team's own source images and aborts if that source folder is absent, so
re-running can never wipe the bundled images.

## Run it

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # static bundle in dist/ → any static host
```

Tech: React + Vite, Tailwind CSS, lucide-react, flag-icons, react-router-dom (HashRouter). Static
site, **no backend, no database**. Deployed to GitHub Pages on every push to `main`
(`.github/workflows/deploy.yml`).

## Important disclaimer

Liberty Compass is an **informational prototype**. Laws and indices are simplified and can be out of
date; every claim shows its evidence type and certainty. **Laws differ from lived experience, and
this is not legal advice.** Always confirm with official government channels and your host
institution before you travel. Built with only publicly available data and openly-licensed or
original assets.

---

Responsible person / Impressum: **Shivang Gupta** · shivangzephyr@gmail.com
