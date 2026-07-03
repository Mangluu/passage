import { scoreTone } from '../lib/dashboard.js'

const BAR = { danger: 'bg-danger', warn: 'bg-warn', success: 'bg-success', ink3: 'bg-ink3' }
const TXT = { danger: 'text-danger', warn: 'text-warn', success: 'text-success', ink3: 'text-ink3' }

// Threshold's per-area score bars, with the origin ("home") marked on each bar.
export default function ScoreRows({ rows, onJump }) {
  return (
    <div className="flex flex-col gap-4">
      {rows.map((r) => {
        const tone = scoreTone(r.destScore)
        return (
          <button key={r.id} type="button" onClick={() => onJump && onJump(r.id)} className="block w-full text-left" title="Jump to the sourced facts">
            <div className="mb-2 flex items-center justify-between gap-2.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface2 font-mono text-[10px] text-ink2">{r.code2}</span>
                <span className="truncate text-[13px] font-medium text-ink">{r.label}</span>
              </span>
              <span className={`shrink-0 text-[14px] font-semibold tnum ${TXT[tone]}`}>{r.destScore}</span>
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
