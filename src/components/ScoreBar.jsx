import { goodness } from '../lib/compare.js'
import { goodnessToTone, TONES } from '../lib/scales.js'

// Renders a numeric index as a bar. The bar always fills toward "more free/safe"
// (regardless of whether the underlying index is higher- or lower-better), so
// longer + greener consistently means better across every metric.
export default function ScoreBar({ aspect, entry }) {
  const g = goodness(aspect, entry)

  if (g == null) {
    return (
      <div className="text-sm text-ink3">
        No data
        {entry?.note && <span className="ml-1 text-ink3">— {entry.note}</span>}
      </div>
    )
  }

  const tone = TONES[goodnessToTone(g)]
  const pct = Math.round(g * 100)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xl font-bold text-ink">
          {entry.value}
          <span className="text-sm font-normal text-ink3">/{aspect.max}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface2">
        <div className={`h-full rounded-full ${tone.bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      {aspect.hint && <div className="mt-1 text-[11px] text-ink3">{aspect.hint}</div>}
    </div>
  )
}
