import { useSearchParams, Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import { JURISDICTION_BY_CODE } from '../data/jurisdictions.js'
import { COUNTRY_BY_CODE } from '../lib/world.js'
import Sidebar from '../components/Sidebar.jsx'
import CountrySelect from '../components/CountrySelect.jsx'
import AudienceSelect from '../components/AudienceSelect.jsx'
import CuratedBriefing from '../components/CuratedBriefing.jsx'
import IndexedComparison from '../components/IndexedComparison.jsx'

// Shell + tier router. Both countries curated (Tier A) → the full hand-verified
// briefing. Any pairing that includes an indexed-only country → the honest
// IndexedComparison over the published indices we hold for both. The sidebar and
// the sticky home→destination selectors are shared, so switching is seamless.
export default function Briefing() {
  const [params, setParams] = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const audKey = params.get('aud') || ''
  const aud = audKey.split(',').filter(Boolean)

  const oInfo = from ? COUNTRY_BY_CODE[from] : null
  const dInfo = to ? COUNTRY_BY_CODE[to] : null
  const origin = JURISDICTION_BY_CODE[from]
  const dest = JURISDICTION_BY_CODE[to]
  const bothCurated = !!(origin && dest)

  function update(patch) {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    setParams(p, { replace: true })
  }
  const toggleAud = (id) => {
    const s = new Set(aud)
    s.has(id) ? s.delete(id) : s.add(id)
    update({ aud: [...s].join(',') })
  }
  const jump = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!oInfo || !dInfo) return <EmptyState />

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar audiences={aud} onToggleAudience={toggleAud} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Sticky header — home → destination, any of the ~199 countries. */}
        <header className="no-print sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-line bg-canvas/90 px-5 py-3 backdrop-blur">
          <Link
            to="/"
            title="Home / start a new search"
            className="flex shrink-0 items-center justify-center rounded-lg border border-line bg-surface p-2 text-ink3 transition hover:text-ink lg:hidden"
          >
            <Home className="h-4 w-4" />
          </Link>
          <div className="flex min-w-[150px] flex-1 basis-0 items-center gap-2">
            <span className="eyebrow w-9 shrink-0">home</span>
            <div className="min-w-0 flex-1">
              <CountrySelect id="from" value={from} exclude={to} onChange={(c) => update({ from: c })} placeholder="Home" />
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink3" aria-hidden="true" />
          <div className="flex min-w-[150px] flex-1 basis-0 items-center gap-2">
            <span className="eyebrow w-9 shrink-0">to</span>
            <div className="min-w-0 flex-1">
              <CountrySelect id="to" value={to} exclude={from} onChange={(c) => update({ to: c })} placeholder="Destination" />
            </div>
          </div>
        </header>

        {/* Mobile audience filter (sidebar is hidden below lg) */}
        <div className="no-print border-b border-line px-5 py-3 lg:hidden">
          <AudienceSelect selected={aud} onToggle={toggleAud} />
        </div>

        {bothCurated ? (
          <CuratedBriefing origin={origin} dest={dest} aud={aud} jump={jump} />
        ) : (
          <IndexedComparison oInfo={oInfo} dInfo={dInfo} />
        )}
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-prose px-5 py-20 text-center">
      <h2 className="font-serif text-2xl text-ink">No briefing to show</h2>
      <p className="mt-2 text-ink2">We couldn’t read a valid home and destination from this link.</p>
      <Link to="/" className="mt-6 inline-flex rounded-lg bg-ink px-5 py-2.5 text-[15px] font-medium text-canvas hover:opacity-90">
        Start a briefing
      </Link>
    </div>
  )
}
