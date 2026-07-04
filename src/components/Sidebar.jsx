import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'
import AudienceSelect from './AudienceSelect.jsx'
import Logo from './Logo.jsx'

export default function Sidebar({ audiences, onToggleAudience }) {
  const { theme, toggle } = useTheme()
  return (
    <aside className="no-print sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-7 overflow-auto border-r border-line bg-surface p-5 lg:flex">
      <Link to="/" className="flex items-center gap-2.5 px-1">
        <Logo className="h-8 w-auto shrink-0 text-accent" />
        <span className="leading-tight">
          <span className="block font-serif text-[18px] font-semibold text-ink">Liberty Compass</span>
          <span className="block text-[10.5px] text-ink3">Liberty &amp; security abroad</span>
        </span>
      </Link>

      <div>
        <div className="eyebrow mb-1">Prioritise information about</div>
        <p className="mb-3.5 text-[11.5px] leading-snug text-ink3">
          Pick who this briefing is for — the facts that matter most move to the top.
        </p>
        <AudienceSelect variant="stack" selected={audiences} onToggle={onToggleAudience} />
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
