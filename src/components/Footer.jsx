import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-7 text-[12px] leading-relaxed text-ink3">
        <p className="text-ink2">
          Passage assembles this briefing in your browser from public, dated sources. No account, no profile, no
          tracking — nothing about you is stored or sent to a server.
        </p>
        <p className="mt-2">
          An informational prototype for B_Hack 2026. Laws and indices are simplified and can be out of date; every
          claim shows its evidence type and how sure we are. Laws differ from lived experience — this is{' '}
          <span className="text-ink2">not legal advice</span>. Verify with official channels before you travel.{' '}
          <Link to="/sources" className="text-accent hover:underline">
            How we source this →
          </Link>
        </p>
      </div>
    </footer>
  )
}
