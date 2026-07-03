import { useState } from 'react'
import { Check } from 'lucide-react'
import Tag from './Tag.jsx'

// Rule-generated checklist. Ticking is ephemeral UI state — nothing is stored.
export default function Checklist({ items }) {
  const [done, setDone] = useState(() => new Set())
  const toggle = (i) =>
    setDone((s) => {
      const n = new Set(s)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })

  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => {
        const on = done.has(i)
        return (
          <li key={i}>
            <button type="button" onClick={() => toggle(i)} className="flex w-full items-start gap-3 text-left">
              <span
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border ${
                  on ? 'border-success bg-success text-white' : 'border-ink3'
                }`}
              >
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`text-[14px] ${on ? 'text-ink3 line-through' : 'text-ink'}`}>{it.label}</span>
                {it.timing && <Tag tone={it.urgent ? 'danger' : 'ink2'}>{it.timing}</Tag>}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
