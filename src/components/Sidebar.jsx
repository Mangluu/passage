import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'
import AudienceSelect from './AudienceSelect.jsx'

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'scores', label: 'Scores' },
  { id: 'adv', label: 'Advisories' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'sources', label: 'Sources' },
]

export default function Sidebar({ audiences, onToggleAudience, onJump }) {
  const { theme, toggle } = useTheme()
  return (
    <aside className="no-print sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-6 overflow-auto border-r border-line bg-surface p-5 lg:flex">
      <Link to="/" className="flex items-center gap-3 px-1">
        <Logo />
        <span className="leading-tight">
          <span className="block font-serif text-[18px] font-semibold text-ink">Passage</span>
          <span className="block text-[10.5px] text-ink3">Liberty &amp; security abroad</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onJump(`sec-${n.id}`)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-ink2 transition hover:bg-surface2 hover:text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-sm bg-ink3" />
            {n.label}
          </button>
        ))}
      </nav>

      <div className="rounded-xl border border-line bg-canvas p-4">
        <div className="eyebrow mb-3">This applies to you</div>
        <AudienceSelect selected={audiences} onToggle={onToggleAudience} />
        <p className="mt-3 text-[11px] leading-snug text-ink3">Filters change what surfaces below. Nothing is stored.</p>
      </div>

      <div className="flex-1" />
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-2 text-[11px] text-ink3">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Nothing about you is saved
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="rounded p-1 text-ink2 transition hover:text-ink"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}

function Logo() {
  return (
    <span className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-ink">
      <span className="absolute inset-x-0 bottom-2 block h-0.5 bg-ink" />
    </span>
  )
}
