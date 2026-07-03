import { ChevronDown, Globe } from 'lucide-react'
import { COUNTRY_OPTIONS, COUNTRY_BY_CODE } from '../data/countries.js'

export default function CountrySelect({ id, label, value, onChange, placeholder = 'Select a country' }) {
  const c = value ? COUNTRY_BY_CODE[value] : null
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink2">
          {label}
        </label>
      )}
      <div className="relative flex items-center rounded-xl border border-line bg-surface shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/30">
        <span className="pl-3">
          {c ? <span className={`fi fi-${c.flag}`} /> : <Globe className="h-4 w-4 text-ink3" />}
        </span>
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent px-3 py-2.5 text-ink focus:outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {COUNTRY_OPTIONS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none mr-3 h-4 w-4 shrink-0 text-ink3" />
      </div>
    </div>
  )
}
