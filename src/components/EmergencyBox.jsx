import { Phone, Shield, Ambulance, Flame } from 'lucide-react'

// Destination emergency numbers — surfaced on the dashboard, no separate page.
export default function EmergencyBox({ country }) {
  if (!country) return null
  const { emergency: e, name, flag } = country
  const rows = [
    { icon: Phone, label: 'Emergency', value: e.general, strong: true },
    { icon: Shield, label: 'Police', value: e.police },
    { icon: Ambulance, label: 'Ambulance', value: e.ambulance },
    { icon: Flame, label: 'Fire', value: e.fire },
  ]
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className={`fi fi-${flag}`} />
        <h3 className="font-semibold text-ink">Emergency in {name}</h3>
      </div>
      <ul className="space-y-2">
        {rows.map(({ icon: Icon, label, value, strong }) => (
          <li key={label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-ink2">
              <Icon className="h-4 w-4 text-ink3" />
              {label}
            </span>
            <span className={`tabular-nums ${strong ? 'text-lg font-bold text-red-600 dark:text-red-400' : 'font-semibold text-ink'}`}>
              {value}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-snug text-ink3">
        Save these before you travel. In the EU, 112 works everywhere.
      </p>
    </div>
  )
}
