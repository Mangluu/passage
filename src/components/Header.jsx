import { Link, NavLink, useLocation } from 'react-router-dom'
import { Sun, Moon, ShieldCheck } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'
import Logo from './Logo.jsx'

// Top masthead for Home & the content pages: wordmark, a static privacy
// statement, and simple nav. The wordmark returns to the landing page; the
// explicit "Home" link is hidden when already on it.
export default function Header() {
  const { theme, toggle } = useTheme()
  const onHome = useLocation().pathname === '/'
  return (
    <header className="no-print border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="h-[54px] w-auto text-accent" />
          <span className="font-serif text-[21px] font-semibold tracking-tight text-ink">Liberty Compass</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-5">
          {/* A statement of what we don't do — informational, not a control. */}
          <span
            className="hidden select-none items-center gap-1.5 sm:inline-flex"
            title="Liberty Compass keeps no account, runs no trackers, and stores nothing about you."
          >
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-ink3">
              No account · No tracking · No data stored
            </span>
          </span>
          <nav className="flex items-center gap-4">
            {!onHome && <HeaderLink to="/">Home</HeaderLink>}
            <HeaderLink to="/sources">Method</HeaderLink>
          </nav>
          <button type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'} className="text-ink2 transition-colors hover:text-ink">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}

function HeaderLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `text-[13px] ${isActive ? 'text-ink' : 'text-ink2 transition-colors hover:text-ink'}`}
    >
      {children}
    </NavLink>
  )
}
