import { Check } from 'lucide-react'
import { AUDIENCES } from '../data/audiences.js'

// Monochrome toggles — selecting an audience re-weights the briefing.
export default function AudienceSelect({ selected, onToggle }) {
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
              on ? 'border-ink bg-ink text-canvas' : 'border-line text-ink2 hover:border-ink3'
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
