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

## Coverage — curated vs. indexed (honest by construction)

Hand-verifying ~195 countries × a dozen topics isn't something a small team can keep truthful,
so coverage is **tiered, and the tier is shown**:

- **Curated (Tier A)** — the 10 countries in `jurisdictions.js`: hand-verified, adversarially
  cross-checked, with the full plain-language briefing.
- **Indexed (Tier B)** — *every* country: three published indices (Freedom House Global Freedom,
  Equaldex LGBT Legal Equality, World Bank Women/Business/Law), each pulled verbatim from its
  source, dated, and linked. Machine-ingested, labelled "indexed — not yet verified", never
  editorialised. Seen on the **Explore** page, and in any comparison that includes a non-curated
  country (Home → Destination accepts all ~199; two curated countries get the full briefing, any
  other pairing gets an honest indexed comparison).
- **Not covered (Tier C)** — if a source has no value for a country, the field is left blank
  ("no data") rather than guessed — the same refuse-don't-invent rule the rest of the app follows.

This is deliberately *more* honest than claiming uniform coverage: a country graduates from
Indexed to Curated as we verify it, and the UI never pretends an index value is a verified fact.

## Structure

```
src/
  data/
    jurisdictions.js   # the claims spine — 10 countries × sourced, dated claims (Tier A, curated)
    world.json         # GENERATED — every country × 3 published indices (Tier B, indexed)
    topics.js          # catalog: position topics (comparable states) + obligations (duties)
    audiences.js       # reader groups → which topics weigh most
    sources.js         # source registry (+ inline per-claim official sources)
  lib/
    severity.js        # pure severity model (critical / notable / minor)
    brief.js           # assembles the briefing: ranked changes, insights, checklist, facts
    dashboard.js       # area scores (published indices + band), advisories, verdict
    world.js           # read layer over world.json (tiers, tone, source metadata)
    useTheme.js        # shared light/dark store
  components/           # Header · Sidebar · Footer · Logo · CountrySelect · AudienceSelect
                        # CityHeader (image carousel) · ScoreRows · OverallScale
                        # FactCard · ClaimMeta · Checklist · Tag
  pages/                # Home · Briefing · Explore · Sources · Privacy · Impressum
  assets/
    fonts/              # self-hosted woff2 (Newsreader · IBM Plex Sans · IBM Plex Mono)
    cities/<code>/1.jpg # genuine, openly-licensed landmark photo per curated country
```

Destination photos are real landmark photography from **Wikimedia Commons** (CC BY-SA / CC0),
each credited in-app with a link back to its source — `src/data/cityPhotos.json` holds the
attribution.

- **Add a country**: one record in `jurisdictions.js` using the same topic keys.
- **Add a topic**: add it to `topics.js` (with its ordered `scale` for a position topic), then add
  the claim to each jurisdiction.

## Scripts

```bash
node scripts/fetch-world.mjs     # rebuild src/data/world.json — every country × 3 indices (FH · Equaldex · World Bank, via OWID)
node scripts/refresh-data.mjs    # print the same indices for the 10 curated countries (spot-check helper)
node scripts/fetch-fonts.mjs     # re-download & self-host the web fonts into src/assets/fonts
node scripts/fetch-cities.mjs    # fetch + optimise genuine CC-licensed landmark photos into src/assets/cities/<code>/
```

`fetch-world.mjs` is keyless and backend-free — it runs at build time (and weekly via
`.github/workflows/refresh-world.yml`), so the all-country data is bundled into the static
page and **nothing is ever fetched in the user's browser**. Its only live dependency is Our
World in Data; ISO codes come from the committed `scripts/iso3166.json`.

`fetch-cities.mjs` is keyless and reproducible — it resolves each hand-picked Commons file to a
width-capped thumbnail, crops it to the 16:9 hero, and only overwrites a country's image once the
new one is in hand (a rate-limited run leaves the existing image untouched).

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
