import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { JURISDICTION_OPTIONS, JURISDICTION_BY_CODE } from '../data/jurisdictions.js'

// A themed dropdown (not a native <select>), so it renders correctly in dark
// mode on every browser/OS — native select popups ignore our color-scheme on
// Windows. Bonus: it can show flags in the list.
export default function CountrySelect({ id, label, value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const c = value ? JURISDICTION_BY_CODE[value] : null

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-left text-[15px] transition hover:border-ink3 focus:border-ink3 focus:outline-none"
        >
          {c ? <span className={`fi fi-${c.flag}`} /> : <Globe className="h-4 w-4 shrink-0 text-ink3" />}
          <span className={`flex-1 truncate ${c ? 'text-ink' : 'text-ink3'}`}>{c ? c.name : placeholder}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-ink3 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-line bg-surface py-1 shadow-lg"
          >
            {JURISDICTION_OPTIONS.map((o) => {
              const sel = o.code === value
              return (
                <li key={o.code} role="option" aria-selected={sel}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.code)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] transition hover:bg-surface2 ${
                      sel ? 'text-ink' : 'text-ink2'
                    }`}
                  >
                    <span className={`fi fi-${o.flag}`} />
                    <span className="flex-1 truncate">{o.name}</span>
                    {sel && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
