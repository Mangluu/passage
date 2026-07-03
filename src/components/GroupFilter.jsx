import * as Icons from 'lucide-react'
import { GROUPS } from '../data/groups.js'

// Toggle chips for the marginalised groups. Selecting a group re-prioritises the
// dashboard — it never hides data.
export default function GroupFilter({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GROUPS.map((g) => {
        const Icon = Icons[g.icon] || Icons.Circle
        const on = selected.includes(g.id)
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onToggle(g.id)}
            aria-pressed={on}
            title={g.blurb}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              on
                ? `${g.accent.chip} border-transparent shadow-sm`
                : 'border-line bg-surface text-ink2 hover:border-slate-400 hover:bg-surface2'
            }`}
          >
            <Icon className="h-4 w-4" />
            {g.label}
          </button>
        )
      })}
    </div>
  )
}
