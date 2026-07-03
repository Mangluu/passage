import Tag from './Tag.jsx'
import { TIER, EVIDENCE_LABEL, yearOf } from '../lib/format.js'
import { resolveSource } from '../data/sources.js'

// Literal class strings so Tailwind keeps them.
const DIR = {
  freer: { dot: 'bg-success border-success', conn: 'bg-success', label: 'text-success' },
  restrictive: { dot: 'bg-danger border-danger', conn: 'bg-danger', label: 'text-danger' },
  same: { dot: 'bg-ink3 border-ink3', conn: 'bg-ink3', label: 'text-ink2' },
}

// The hero widget: a topic's ordinal scale with home and destination pinned.
// Honest by construction — it draws the real scale, not an invented number.
export default function ScaleStrip({ topic, fromClaim, toClaim, direction, tier, isFor, onJump }) {
  const n = topic.scale.length - 1
  const oi = fromClaim.o
  const di = toClaim.o
  const pct = (i) => (n ? (i / n) * 100 : 0)
  const lo = Math.min(oi, di)
  const hi = Math.max(oi, di)
  const dir = DIR[direction] || DIR.same
  const s = resolveSource(toClaim.src)
  const tierInfo = TIER[tier] || TIER.minor

  return (
    <button type="button" onClick={onJump} className="block w-full text-left" title="Jump to the sourced detail">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[14px] font-medium text-ink">
          {topic.label}
          {isFor && <span className="ml-1.5 text-[11px] text-accent">· for you</span>}
        </span>
        <Tag tone={tierInfo.tone} className="uppercase tracking-wide">{tierInfo.label}</Tag>
      </div>

      <div className="relative my-3 h-4">
        <div className="absolute left-0 right-0 top-[7px] h-[3px] rounded bg-surface2" />
        <div className={`absolute top-[7px] h-[3px] rounded ${dir.conn}`} style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <span className="absolute top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-ink3 bg-surface" style={{ left: `${pct(oi)}%` }} />
        <span className={`absolute top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 ${dir.dot}`} style={{ left: `${pct(di)}%` }} />
      </div>

      <div className="grid gap-1 text-[11px] text-ink3" style={{ gridTemplateColumns: `repeat(${topic.scale.length}, minmax(0, 1fr))` }}>
        {topic.scale.map((lbl, i) => (
          <span
            key={i}
            className={`${i === 0 ? 'text-left' : i === n ? 'text-right' : 'text-center'} ${
              i === di ? `font-medium ${dir.label}` : i === oi ? 'text-ink2' : ''
            }`}
          >
            {lbl}
          </span>
        ))}
      </div>

      <div className="mt-2 text-[11.5px] text-ink3">
        {EVIDENCE_LABEL[toClaim.ev]} · {yearOf(toClaim.asOf)} · {s.org} <span className="text-accent">›</span>
      </div>
    </button>
  )
}
