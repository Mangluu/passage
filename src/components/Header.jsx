import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/useTheme.js'

// Top masthead for Home & Sources (Threshold style: wordmark + privacy chips).
export default function Header() {
  const { theme, toggle } = useTheme()
  return (
    <header className="no-print border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-serif text-[21px] font-semibold tracking-tight text-ink">Passage</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden gap-1.5 sm:flex">
            {['No account', 'No tracking', 'No data stored'].map((t) => (
              <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] text-ink3">
                {t}
              </span>
            ))}
          </div>
          <NavLink
            to="/sources"
            className={({ isActive }) => `text-[13px] ${isActive ? 'text-ink' : 'text-ink2 transition-colors hover:text-ink'}`}
          >
            Method
          </NavLink>
          <button type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'} className="text-ink2 transition-colors hover:text-ink">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <span className="relative block h-7 w-7 overflow-hidden rounded-full border-2 border-ink">
      <span className="absolute inset-x-0 bottom-2 block h-0.5 bg-ink" />
    </span>
  )
}
