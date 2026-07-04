// Original, public-domain skyline illustration for the hero — generated, so it
// carries zero copyright risk and needs no external image request (privacy by
// design stays intact). Deterministic per country, and theme-aware via tokens.
const CITY = {
  US: 'Washington, D.C.',
  BR: 'Brasília',
  DE: 'Berlin',
  NO: 'Oslo',
  KE: 'Nairobi',
  EG: 'Cairo',
  ZA: 'Cape Town',
  CN: 'Beijing',
  AU: 'Canberra',
  UZ: 'Tashkent',
}

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
    const spire = rng() > 0.78
    out.push({ x, w, h, spire })
    x += w + gap + rng() * 8
  }
  return out
}

export default function CityHeader({ dest }) {
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

        {/* haze the foreground so the country name stays readable over any skyline */}
        <rect x="0" y="92" width="400" height="58" fill={`url(#scrim-${dest.code})`} />
      </svg>

      <span className="absolute right-3 top-3 rounded bg-surface/70 px-2 py-1 font-mono text-[9px] text-ink3 backdrop-blur-sm">
        {CITY[dest.code] || dest.name}
      </span>
    </div>
  )
}
