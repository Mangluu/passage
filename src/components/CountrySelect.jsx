import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Globe, Check, Search, Star } from 'lucide-react'
import { COUNTRIES, COUNTRY_BY_CODE } from '../lib/world.js'

// A themed, searchable combobox for picking any of the ~199 countries. Not a
// native <select> (those ignore our color-scheme on Windows) and not a bare text
// box (typos → no match); instead a dropdown with a filter field that keeps the
// flags and constrains to real countries. Curated countries — the ones with a
// full hand-verified briefing — are flagged with a star.
export default function CountrySelect({ id, label, value, onChange, placeholder = 'Select…', exclude }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const c = value ? COUNTRY_BY_CODE[value] : null

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter((o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase() === q)
  }, [query])

  useEffect(() => {
    if (!open) return
    setActive(0)
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) close() }
    document.addEventListener('mousedown', onDoc)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', onDoc) }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function close() {
    setOpen(false)
    setQuery('')
  }
  function choose(code) {
    if (code === exclude) return
    onChange(code)
    close()
  }
  function onKey(e) {
    if (e.key === 'Escape') return close()
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); const o = results[active]; if (o) choose(o.code) }
  }

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  return (
    <div ref={ref}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink2">{label}</label>
      )}
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-left text-[15px] transition hover:border-ink3 focus:border-ink3 focus:outline-none"
        >
          {c ? <span className={`fi fi-${c.flag}`} /> : <Globe className="h-4 w-4 shrink-0 text-ink3" />}
          <span className={`flex-1 truncate ${c ? 'text-ink' : 'text-ink3'}`}>{c ? c.name : placeholder}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-ink3 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
            <div className="relative border-b border-line">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type a country…"
                aria-label="Search countries"
                className="w-full bg-transparent py-2.5 pl-9 pr-3 text-[14px] text-ink placeholder:text-ink3 focus:outline-none"
              />
            </div>
            <ul ref={listRef} role="listbox" className="max-h-64 overflow-auto py-1">
              {results.length === 0 && (
                <li className="px-3 py-3 text-[13px] text-ink3">No country matches “{query}”.</li>
              )}
              {results.map((o, i) => {
                const sel = o.code === value
                const disabled = o.code === exclude
                return (
                  <li key={o.code} role="option" aria-selected={sel} aria-disabled={disabled}>
                    <button
                      type="button"
                      disabled={disabled}
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(o.code)}
                      title={disabled ? 'Already selected as the other country' : o.curated ? 'Full verified briefing available' : undefined}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] transition ${
                        disabled
                          ? 'cursor-not-allowed text-ink3 opacity-45'
                          : `${i === active ? 'bg-surface2' : ''} ${sel ? 'text-ink' : 'text-ink2'}`
                      }`}
                    >
                      <span className={`fi fi-${o.flag}`} />
                      <span className="flex-1 truncate">{o.name}</span>
                      {o.curated && !disabled && (
                        <Star className="h-3 w-3 shrink-0 fill-accent text-accent" aria-label="Full briefing" />
                      )}
                      {disabled && <span className="shrink-0 font-mono text-[10px] text-ink3">in use</span>}
                      {sel && !disabled && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-line px-3 py-2 text-[10.5px] text-ink3">
              <Star className="mr-1 inline h-2.5 w-2.5 fill-accent text-accent" /> full verified briefing · others show published indices
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
