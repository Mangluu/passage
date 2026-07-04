import { Info } from 'lucide-react'
import { scoreTone, tipFrom } from '../lib/dashboard.js'
import { CLUSTER_ICON } from '../lib/icons.js'

const BAR = { danger: 'bg-danger', warn: 'bg-warn', success: 'bg-success', ink3: 'bg-ink3' }
const TXT = { danger: 'text-danger', warn: 'text-warn', success: 'text-success', ink3: 'text-ink3' }

// Per-area score bars with the origin ("home") marked. Each row leads with the
// tier word, and hovering reveals the sourced facts behind the number.
export default function ScoreRows({ rows, onJump }) {
  return (
    <div className="flex flex-col gap-4">
      {rows.map((r) => {
        const tone = scoreTone(r.destScore)
        const AreaIcon = CLUSTER_ICON[r.id] || Info
        const tip = `${r.label} — ${r.destScore}/100\n\n${tipFrom(r.breakdown)}`
        return (
          <button key={r.id} type="button" onClick={() => onJump && onJump(r.id)} className="block w-full text-left" title={tip}>
            <div className="mb-2 flex items-center justify-between gap-2.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface2 text-ink2"><AreaIcon className="h-3.5 w-3.5" /></span>
                <span className="truncate text-[13px] font-medium text-ink">{r.label}</span>
                <Info className="h-3 w-3 shrink-0 text-ink3" aria-hidden="true" />
              </span>
              <span className="flex shrink-0 items-baseline gap-1.5">
                <span className={`text-[14px] font-semibold tnum ${TXT[tone]}`}>{r.destScore}</span>
                <span className="text-[11px] text-ink3">{r.tier}</span>
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded bg-surface2">
              <div className={`absolute inset-y-0 left-0 rounded ${BAR[tone]}`} style={{ width: `${r.destScore}%` }} />
            </div>
            {r.originScore != null && (
              <div className="relative mt-0.5 h-3">
                <div className="absolute -top-[9px] h-3 w-[2px] bg-ink3/70" style={{ left: `${r.originScore}%`, transform: 'translateX(-50%)' }} />
                <div className="absolute top-0 whitespace-nowrap font-mono text-[9px] text-ink3" style={{ left: `${r.originScore}%`, transform: 'translateX(-50%)' }}>
                  home {r.originScore}
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
