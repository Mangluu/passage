import { Check } from 'lucide-react'
import { AUDIENCES } from '../data/audiences.js'

// Selecting an audience re-weights the briefing toward what matters to that
// reader. Two layouts: "chips" (wrapping pills, used on Home & the mobile bar)
// and "stack" (one full-width button per line, used in the sidebar).
export default function AudienceSelect({ selected, onToggle, variant = 'chips' }) {
  if (variant === 'stack') {
    return (
      <div className="flex flex-col gap-2">
        {AUDIENCES.map((a) => {
          const on = selected.includes(a.id)
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              aria-pressed={on}
              title={a.blurb}
              className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] font-medium transition ${
                on ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink2 hover:border-ink3 hover:text-ink'
              }`}
            >
              <span>{a.label}</span>
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  on ? 'border-white/70 bg-white/15' : 'border-ink3'
                }`}
              >
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {AUDIENCES.map((a) => {
        const on = selected.includes(a.id)
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onToggle(a.id)}
            aria-pressed={on}
            title={a.blurb}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition ${
              on ? 'border-accent bg-accent text-white' : 'border-line text-ink2 hover:border-ink3'
            }`}
          >
            {on && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            {a.label}
          </button>
        )
      })}
    </div>
  )
}
