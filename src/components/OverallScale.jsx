import { scoreTone } from '../lib/dashboard.js'

const DOT = { danger: 'bg-danger', warn: 'bg-warn', success: 'bg-success', ink3: 'bg-ink3' }

// The single "overall position" scale — home vs destination on one red→green track.
export default function OverallScale({ origin, dest, originScore, destScore }) {
  const tone = scoreTone(destScore)
  return (
    <div>
      <div className="relative mb-3.5 h-6">
        <div
          className="absolute inset-x-0 top-[9px] h-1.5 rounded"
          style={{ background: 'linear-gradient(90deg, #b24a2e 0%, #b06e28 50%, #4a7a42 100%)' }}
        />
        {originScore != null && (
          <div
            className="absolute top-[1px] h-[17px] w-[17px] -translate-x-1/2 rounded-full border-[2.5px] border-ink3 bg-canvas"
            style={{ left: `${originScore}%` }}
            title={`${origin.name} (home)`}
          />
        )}
        <div
          className={`absolute top-0 h-[19px] w-[19px] -translate-x-1/2 rounded-full border-[2.5px] border-surface shadow-pop ${DOT[tone]}`}
          style={{ left: `${destScore}%` }}
          title={`${dest.name}`}
        />
      </div>
      <div className="eyebrow mb-4 flex justify-between">
        <span>← more restricted</span>
        <span>more protected →</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <span className="flex items-center gap-2 text-[12px] text-ink2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-ink3" /> {origin.name} (home)
        </span>
        <span className="flex items-center gap-2 text-[12px] text-ink2">
          <span className={`h-2.5 w-2.5 rounded-full ${DOT[tone]}`} /> {dest.name} (destination)
        </span>
      </div>
    </div>
  )
}
