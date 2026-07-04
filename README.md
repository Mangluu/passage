# Liberty Compass — pre-departure briefings for exchange students

**B_Hack Baltic Sea Region Hackathon 2026 · Track: Liberty & Security · Group 6**

Liberty Compass turns "how do liberty and security differ between home and my destination?" into a
**sourced, dated briefing document** — specific to who you are. Not a country score card. Every
fact is a claim that carries its evidence type, the date it reflects, its source, and how sure
we are.

Pick your home country, your destination, and (optionally) the group(s) you belong to. Liberty Compass
assembles a briefing that:

- **Ranks what changes for you** by severity — anything the destination criminalises, enforces or
  prohibits that's relevant to you is Critical; new legal duties with short deadlines are Notable.
- **Surfaces cross-cutting risks** a search wouldn't volunteer — e.g. *the return trip*: cannabis
  legal at your destination is still a felony under your home law when you go back.
- **Flags new duties on arrival** — address registration (Germany's 14-day Anmeldung, China's
  24-hour police registration), work-hour caps, insurance mandates — and turns them into a checklist.
- **Shows every claim's provenance** — Law / Published index / Reported practice / Advisory, dated,
  linked, with an Established / Limited-data / Anecdotal certainty label. No invented scores.

No accounts. No profiles. No tracking. Your choices live only in the page URL; the briefing is
assembled in your browser. Privacy by design. Light & dark theme, and it prints as a clean document.

## Why claims, not scores

The first version showed 0–100 "safety scores". They looked authoritative but several were
invented — fatal for a trust product. v2 deletes every synthetic number. What remains is a spine
of **claims**: plain statements grounded in law and published indices, each verifiable at its
source. The legal facts were cross-checked in an **adversarial verification pass** (multi-agent
web research that tries to prove each claim wrong against primary/official sources).

## Data model

```
src/
  data/
    topics.js          # the catalog: position topics (comparable states) + obligations (duties)
    jurisdictions.js   # the claims spine — 10 countries × sourced, dated claims
    audiences.js       # reader groups → which topics weigh most
    sources.js         # source registry (+ inline per-claim official sources)
  lib/
    severity.js        # pure severity model (critical / notable / minor)
    brief.js           # assembles the briefing: ranked changes, insights, checklist, facts
    format.js          # evidence / certainty / tier labels
  components/           # Tag · ClaimMeta · DeltaRow · FactCard · Checklist · AudienceSelect …
  pages/                # Home · Briefing · Sources (method & sources)
```

- **Add a country**: one record in `jurisdictions.js` using the same topic keys.
- **Add a topic**: add it to `topics.js` (with its ordered `scale` for a position topic), then add
  the claim to each jurisdiction.
- Refresh the published indices that back some claims:
  ```bash
  node scripts/refresh-data.mjs   # Equaldex · World Bank · Freedom House, via Our World in Data
  ```

## Run it

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # static bundle → any host (deployed to GitHub Pages on every push)
```

Tech: React + Vite, Tailwind CSS, lucide-react, flag-icons, react-router-dom (HashRouter). Static
site, no backend, no database.

## Important disclaimer

Liberty Compass is an **informational prototype**. Laws and indices are simplified and can be out of date;
every claim shows its evidence type and certainty. **Laws differ from lived experience, and this is
not legal advice.** Always confirm with official government channels and your host institution
before you travel. Built with only publicly available data and openly-licensed assets.
