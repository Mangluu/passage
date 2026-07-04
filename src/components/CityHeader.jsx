import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Destination hero. Cycles through the team's own images for the country as an
// auto-advancing carousel (playful image first, realistic photos after). The
// hero is a 16:9 box and the images are 16:9, so each one fills it edge-to-edge
// (object-cover) with no cropping of the subject. All images are bundled
// locally; no runtime external request. Falls back to a generated skyline if a
// country has no images.

const files = import.meta.glob('../assets/cities/*/*.jpg', { eager: true, import: 'default' })
const BY_CODE = {}
for (const [path, url] of Object.entries(files)) {
  const m = path.match(/cities\/([a-z]{2})\/(\d+)\.jpg$/)
  if (!m) continue
  const code = m[1]
  ;(BY_CODE[code] ||= []).push({ n: Number(m[2]), url })
}
for (const code of Object.keys(BY_CODE)) BY_CODE[code].sort((a, b) => a.n - b.n)
const imagesFor = (code) => (BY_CODE[code.toLowerCase()] || []).map((x) => x.url)

const CITY = {
  US: 'New York', BR: 'Rio de Janeiro', DE: 'Berlin', NO: 'Oslo', KE: 'Nairobi',
  EG: 'Cairo', ZA: 'Cape Town', CN: 'Beijing', AU: 'Sydney', UZ: 'Tashkent',
}

export default function CityHeader({ dest }) {
  const imgs = imagesFor(dest.code)
  const cityName = CITY[dest.code] || dest.name
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  // Reset to the first (playful) image whenever the destination changes.
  useEffect(() => setIdx(0), [dest.code])

  // Auto-advance, paused on hover/focus.
  useEffect(() => {
    if (paused || imgs.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 5000)
    return () => clearInterval(t)
  }, [paused, imgs.length, dest.code])

  if (!imgs.length) return <Skyline dest={dest} cityName={cityName} />

  const go = (d) => setIdx((i) => (i + d + imgs.length) % imgs.length)

  return (
    <div
      className="group absolute inset-0 bg-surface2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {imgs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === idx ? `${cityName}, ${dest.name}` : ''}
          aria-hidden={i !== idx}
          draggable="false"
          className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Bottom scrim so the overlaid country name stays legible. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: 'linear-gradient(to top, rgb(var(--c-surface)) 6%, rgba(var(--c-surface) / 0.42) 40%, transparent)' }}
      />

      <span className="absolute right-3 top-3 z-20 rounded bg-surface/80 px-2 py-1 font-mono text-[9px] text-ink2 backdrop-blur-sm">
        {cityName}
      </span>

      {imgs.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-surface/70 p-1.5 text-ink2 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-surface hover:text-ink focus:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-surface/70 p-1.5 text-ink2 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-surface hover:text-ink focus:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2.5 right-3 z-20 flex gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show image ${i + 1} of ${imgs.length}`}
                aria-current={i === idx}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-ink' : 'w-1.5 bg-ink/35 hover:bg-ink/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
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
