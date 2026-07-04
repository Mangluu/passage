import { CITY_CREDITS } from '../data/cityCredits.js'

// Hero image for the destination. Prefers a real, CC-licensed city photo (see
// scripts/fetch-cities.mjs) bundled locally — no runtime external request — and
// falls back to an original generated skyline where no permissive photo exists.
// A bottom scrim keeps the country name readable over any image.

const cityPhotos = import.meta.glob('../assets/cities/*.jpg', { eager: true, import: 'default' })
function photoFor(code) {
  const key = Object.keys(cityPhotos).find((p) => p.toLowerCase().endsWith(`/${code.toLowerCase()}.jpg`))
  return key ? cityPhotos[key] : null
}

const CITY = {
  US: 'New York', BR: 'Rio de Janeiro', DE: 'Berlin', NO: 'Oslo', KE: 'Nairobi',
  EG: 'Cairo', ZA: 'Cape Town', CN: 'Beijing', AU: 'Sydney', UZ: 'Tashkent',
}

export default function CityHeader({ dest }) {
  const photo = photoFor(dest.code)
  const credit = CITY_CREDITS[dest.code.toLowerCase()]
  const cityName = (credit && credit.city) || CITY[dest.code] || dest.name

  if (photo) {
    return (
      <div className="absolute inset-0">
        <img src={photo} alt={`${cityName}, ${dest.name}`} className="h-full w-full object-cover" />
        <div
          className="absolute inset-x-0 bottom-0 h-28"
          style={{ background: 'linear-gradient(to top, rgb(var(--c-surface)) 12%, rgba(var(--c-surface) / 0.55) 45%, transparent)' }}
        />
        <span className="absolute right-3 top-3 rounded bg-surface/75 px-2 py-1 font-mono text-[9px] text-ink3 backdrop-blur-sm">
          {cityName}
        </span>
        {credit && (
          <a
            href={credit.source}
            target="_blank"
            rel="noreferrer"
            title={`${credit.artist} · ${credit.licence} · via Wikimedia Commons`}
            className="absolute bottom-1.5 right-2.5 font-mono text-[8px] text-ink3 hover:text-ink2"
          >
            © {credit.licence} ↗
          </a>
        )}
      </div>
    )
  }

  return <Skyline dest={dest} cityName={cityName} />
}

// ── Generated skyline fallback ───────────────────────────────────────────────
function seed(code) {
  let h = 2166136261
  for (const ch of code) h = (h ^ ch.charCodeAt(0)) * 16777619
  return h >>> 0
}
function makeRng(s) {
  let x = s || 1
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    return x / 0x7fffffff
  }
}
function skyline(rng, { W, base, minH, maxH, gap }) {
  const out = []
  let x = -8
  while (x < W + 8) {
    const w = 12 + rng() * 26
    const h = minH + rng() * (maxH - minH)
    out.push({ x, w, h, spire: rng() > 0.78 })
    x += w + gap + rng() * 8
  }
  return out
}

function Skyline({ dest, cityName }) {
  const W = 400
  const base = 120
  const rng = makeRng(seed(dest.code))
  const back = skyline(rng, { W, base, minH: 26, maxH: 60, gap: 3 })
  const front = skyline(rng, { W, base, minH: 40, maxH: 92, gap: 5 })
  const sunX = 40 + (seed(dest.code) % 320)

  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`sky-${dest.code}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--c-surface))" />
            <stop offset="0.55" stopColor="rgb(var(--c-surface2))" />
            <stop offset="1" stopColor="rgb(var(--c-accent-bg))" />
          </linearGradient>
          <linearGradient id={`scrim-${dest.code}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--c-surface))" stopOpacity="0" />
            <stop offset="1" stopColor="rgb(var(--c-surface))" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="400" height="150" fill={`url(#sky-${dest.code})`} />
        <circle cx={sunX} cy={base - 44} r="21" fill="rgb(var(--c-accent))" opacity="0.22" />
        <g fill="rgb(var(--c-ink))" opacity="0.2">
          {back.map((b, i) => (
            <rect key={i} x={b.x} y={base - b.h} width={b.w} height={b.h + 30} rx="1" />
          ))}
        </g>
        <g fill="rgb(var(--c-ink))" opacity="0.62">
          {front.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={base - b.h} width={b.w} height={b.h + 30} rx="1" />
              {b.spire && <rect x={b.x + b.w / 2 - 1} y={base - b.h - 16} width="2" height="16" />}
            </g>
          ))}
        </g>
        <rect x="0" y="92" width="400" height="58" fill={`url(#scrim-${dest.code})`} />
      </svg>
      <span className="absolute right-3 top-3 rounded bg-surface/70 px-2 py-1 font-mono text-[9px] text-ink3 backdrop-blur-sm">
        {cityName}
      </span>
    </div>
  )
}
