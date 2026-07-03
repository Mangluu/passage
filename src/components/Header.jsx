import { Link, NavLink } from 'react-router-dom'
import { Compass, Lock, Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'

export default function Header() {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-ink">Passage</span>
            <span className="block text-[11px] text-ink3">Liberty & security, mapped to you</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <NavItem to="/" label="Home" />
          <NavItem to="/sources" label="Sources" />
          <span className="ml-2 hidden items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 sm:inline-flex">
            <Lock className="h-3 w-3" /> We store nothing
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="ml-1 rounded-lg p-2 text-ink2 transition hover:bg-surface2"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `rounded-lg px-3 py-1.5 font-medium transition ${
          isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-ink2 hover:bg-surface2'
        }`
      }
    >
      {label}
    </NavLink>
  )
}
