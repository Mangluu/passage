import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon, ShieldCheck } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'

// Top masthead for Home & the content pages (Threshold style: wordmark, a
// static privacy statement, and simple nav). The wordmark and the Home link
// both return to the landing page.
export default function Header() {
  const { theme, toggle } = useTheme()
  return (
    <header className="no-print border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-serif text-[21px] font-semibold tracking-tight text-ink">Passage</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-5">
          {/* A statement of what we don't do — informational, not a control. */}
          <span
            className="hidden select-none items-center gap-1.5 sm:inline-flex"
            title="Passage keeps no account, runs no trackers, and stores nothing about you."
          >
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-ink3">
              No account · No tracking · No data stored
            </span>
          </span>
          <nav className="flex items-center gap-4">
            <HeaderLink to="/">Home</HeaderLink>
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

function Logo() {
  return (
    <span className="relative block h-7 w-7 overflow-hidden rounded-full border-2 border-ink">
      <span className="absolute inset-x-0 bottom-2 block h-0.5 bg-ink" />
    </span>
  )
}
