import { ChevronDown, Globe } from 'lucide-react'
import { JURISDICTION_OPTIONS, JURISDICTION_BY_CODE } from '../data/jurisdictions.js'

export default function CountrySelect({ id, label, value, onChange, placeholder = 'Select…' }) {
  const c = value ? JURISDICTION_BY_CODE[value] : null
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink2">
          {label}
        </label>
      )}
      <div className="relative flex items-center rounded-lg border border-line bg-surface transition focus-within:border-ink3">
        <span className="pl-3">
          {c ? <span className={`fi fi-${c.flag}`} /> : <Globe className="h-4 w-4 text-ink3" />}
        </span>
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent px-2.5 py-2.5 text-[15px] text-ink focus:outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {JURISDICTION_OPTIONS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none mr-3 h-4 w-4 shrink-0 text-ink3" aria-hidden="true" />
      </div>
    </div>
  )
}
