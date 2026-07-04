import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 font-mono text-[11px] text-ink3 sm:flex-row sm:items-center sm:justify-between">
        <span>Liberty Compass · B-Hack Baltic Sea Region 2026 · Group 6</span>
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          <Link to="/sources" className="transition-colors hover:text-ink">Sources</Link>
          <Link to="/privacy" className="transition-colors hover:text-ink">Privacy</Link>
          <Link to="/impressum" className="transition-colors hover:text-ink">Impressum</Link>
        </span>
      </div>
    </footer>
  )
}
