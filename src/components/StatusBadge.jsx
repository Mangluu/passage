import { statusEntry, TONES } from '../lib/scales.js'
import { valueLabel } from '../lib/format.js'

// Renders a categorical aspect as a coloured pill.
export default function StatusBadge({ aspect, entry }) {
  if (!entry || entry.ordinal == null) {
    return <span className="text-sm text-ink3">No data</span>
  }
  const base = statusEntry(aspect.scale, entry.ordinal)
  const tone = TONES[base?.tone || 'na']
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ${tone.badge}`}>
      {valueLabel(aspect, entry)}
    </span>
  )
}
