import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, ShieldCheck, X } from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import {
  COUNTRIES, REGIONS, INDICES, INDEX_KEYS, INDEX_SHORT, COUNTRY_COUNT, CURATED_CODES,
  WORLD_GENERATED_AT, indexView,
} from '../lib/world.js'

const BAR_BG = { success: 'bg-success', warn: 'bg-warn', danger: 'bg-danger', ink3: 'bg-ink3' }
const TXT = { success: 'text-success', warn: 'text-warn', danger: 'text-danger', ink3: 'text-ink3' }

// Explore — the Tier B surface. Every country, with the three published indices
// we bundle at build time, each dated and sourced. Honest by construction: a
// value we don't have is simply absent, and "indexed" is labelled as distinct
// from the hand-verified curated briefings.
export default function Explore() {
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return COUNTRIES.filter((c) => {
      if (region && c.region !== region) return false
      if (needle && !c.name.toLowerCase().includes(needle) && c.code.toLowerCase() !== needle) return false
      return true
    })
  }, [q, region])

  const curatedShown = list.filter((c) => c.curated).length

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {/* Intro */}
        <div className="max-w-3xl">
          <div className="eyebrow mb-3">All countries · indexed</div>
          <h1 className="font-serif text-[36px] font-medium leading-[1.08] tracking-tight text-ink sm:text-[44px]">
            Every country, indexed — and honest about it.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink2">
            The full briefing is hand-verified for {CURATED_CODES.size} countries. For the other {COUNTRY_COUNT - CURATED_CODES.size},
            here are three published indices — pulled straight from the source, dated, and never invented. If we don’t
            have a value, we leave it blank rather than guess.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-ink3">
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            Assembled at build time · bundled into the page · no tracking, nothing about you leaves your browser
            {WORLD_GENERATED_AT && <span>· data refreshed {WORLD_GENERATED_AT}</span>}
          </p>
        </div>

        {/* What the three indices are — the provenance legend for every value below */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {INDEX_KEYS.map((k) => {
            const m = INDICES[k]
            return (
              <div key={k} className="card p-4">
                <div className="text-[13px] font-semibold text-ink">{INDEX_SHORT[k]}</div>
                <p className="mt-1 text-[11.5px] leading-snug text-ink3">{m.note}</p>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-accent hover:underline"
                >
                  {m.org} <ExternalLink className="h-3 w-3" />
                </a>
                <span className="ml-1 font-mono text-[10px] text-ink3">via {m.via}</span>
              </div>
            )
          })}
        </div>

        {/* Tier legend — the honesty spine */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line bg-surface2/40 px-4 py-3 text-[12px] text-ink2">
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded bg-accent-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">Curated</span>
            hand-verified full briefing
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded bg-surface2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink3">Indexed</span>
            published indices only — not yet verified
          </span>
          <span className="text-ink3">A blank value = we don’t have it. Laws differ from lived experience; not legal advice.</span>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink3" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a country…"
              className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-9 text-[15px] text-ink placeholder:text-ink3 focus:border-ink3 focus:outline-none"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink3 hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={!region} onClick={() => setRegion('')}>All regions</FilterChip>
          {REGIONS.map((r) => (
            <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</FilterChip>
          ))}
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <p className="text-[12px] text-ink3">
            {list.length} {list.length === 1 ? 'country' : 'countries'}
            {curatedShown > 0 && <> · {curatedShown} curated</>}
          </p>
        </div>

        {/* Grid */}
        {list.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => <CountryCard key={c.code} c={c} />)}
          </div>
        ) : (
          <p className="mt-10 text-center text-[14px] text-ink2">No country matches “{q}”.</p>
        )}

        <p className="mt-10 border-t border-line pt-5 text-[12px] leading-relaxed text-ink3">
          “Indexed” countries show published index values only — machine-ingested, each dated and linked, but without the
          per-claim legal verification the curated briefings carry. A value’s year is the year the source reflects, not
          today.{' '}
          <Link to="/sources" className="text-accent hover:underline">Full method &amp; sources →</Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}

function CountryCard({ c }) {
  return (
    <div className="card flex flex-col p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`fi fi-${c.flag} shrink-0`} style={{ width: '1.5rem', height: '1.125rem' }} role="img" aria-label={`${c.name} flag`} />
        <span className="min-w-0 flex-1 truncate font-serif text-[16px] font-semibold text-ink" title={c.name}>{c.name}</span>
        {c.curated ? (
          <span className="shrink-0 rounded bg-accent-bg px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-accent">Curated</span>
        ) : (
          <span className="shrink-0 rounded bg-surface2 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-ink3">Indexed</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        {INDEX_KEYS.map((k) => <MetricRow key={k} c={c} k={k} />)}
      </div>
    </div>
  )
}

function MetricRow({ c, k }) {
  const v = indexView(c, k)
  const m = INDICES[k]
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11.5px] text-ink2">{INDEX_SHORT[k]}</span>
        {v ? (
          <span className="shrink-0 font-mono text-[11px] tnum text-ink3">
            <span className={`font-semibold ${TXT[v.tone]}`}>{v.value}</span>
            <span className="text-ink3">/100 · {v.asOf}</span>
          </span>
        ) : (
          <span className="shrink-0 font-mono text-[11px] text-ink3" title={`No ${m.org} value for ${c.name}`}>no data</span>
        )}
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface2">
        {v && <div className={`h-full rounded-full ${BAR_BG[v.tone]}`} style={{ width: `${v.value}%` }} />}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[12px] transition ${
        active ? 'border-ink bg-ink text-canvas' : 'border-line text-ink2 hover:border-ink3 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
