import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'

// Editorial masthead — a document letterhead, not an app chrome bar.
export default function Header() {
  const { theme, toggle } = useTheme()
  return (
    <header className="no-print border-b border-line bg-canvas">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-baseline gap-2.5">
          <span className="font-serif text-[22px] font-semibold tracking-tight text-ink">Passage</span>
          <span className="hidden text-[12px] text-ink3 sm:inline">pre-departure briefings</span>
        </Link>

        <nav className="flex items-center gap-5 text-[14px]">
          <NavItem to="/" label="Home" />
          <NavItem to="/sources" label="Method &amp; sources" />
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="-my-1 rounded p-1 text-ink2 transition hover:text-ink"
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
      className={({ isActive }) => (isActive ? 'text-ink' : 'text-ink2 transition-colors hover:text-ink')}
    >
      {label}
    </NavLink>
  )
}
