import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-ink2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            Privacy by design — no accounts, no profiles, no tracking. Your selections stay in your browser’s URL only.
          </p>
          <Link to="/sources" className="font-medium text-brand-600 dark:text-brand-300 hover:underline">
            Sources & methodology →
          </Link>
        </div>
        <p className="mt-3 text-ink3">
          Passage is an informational prototype built for B_Hack 2026. Data is compiled from public sources and may be
          outdated or simplified. Laws differ from lived experience — this is <strong>not legal advice</strong>. Always
          verify with official channels before you travel.
        </p>
      </div>
    </footer>
  )
}
