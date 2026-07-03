import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeftRight, Printer, ArrowRight, AlertTriangle, Phone } from 'lucide-react'
import { JURISDICTION_BY_CODE } from '../data/jurisdictions.js'
import { AUDIENCE_BY_ID } from '../data/audiences.js'
import { buildBrief } from '../lib/brief.js'
import CountrySelect from '../components/CountrySelect.jsx'
import AudienceSelect from '../components/AudienceSelect.jsx'
import DeltaRow from '../components/DeltaRow.jsx'
import FactCard from '../components/FactCard.jsx'
import Checklist from '../components/Checklist.jsx'

export default function Briefing() {
  const [params, setParams] = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const audKey = params.get('aud') || ''
  const aud = audKey.split(',').filter(Boolean)
  const origin = JURISDICTION_BY_CODE[from]
  const dest = JURISDICTION_BY_CODE[to]

  const brief = useMemo(() => buildBrief(origin, dest, aud), [from, to, audKey]) // eslint-disable-line

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

  if (!origin || !dest || !brief) return <EmptyState />

  const { counts } = brief
  const factCount = brief.facts.reduce((n, c) => n + c.items.length, 0)
  const issued = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const audienceLabel = aud.length ? aud.map((id) => AUDIENCE_BY_ID[id]?.label).filter(Boolean).join(' · ') : 'a general reader'

  return (
    <div>
      {/* Controls — not part of the document, hidden when printed */}
      <div className="no-print border-b border-line bg-canvas">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-2">
            <div className="w-36 sm:w-44">
              <CountrySelect id="from" label="Home" value={from} onChange={(c) => update({ from: c })} />
            </div>
            <button
              type="button"
              onClick={() => update({ from: to, to: from })}
              title="Swap"
              className="mb-1 rounded-lg border border-line p-2 text-ink3 transition hover:text-ink"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <div className="w-36 sm:w-44">
              <CountrySelect id="to" label="Destination" value={to} onChange={(c) => update({ to: c })} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AudienceSelect selected={aud} onToggle={toggleAud} />
            <Link to="/" className="text-[13px] text-accent hover:underline">
              New briefing
            </Link>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-prose px-5 py-8">
        {/* Letterhead */}
        <div className="border-t-2 border-ink pt-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12px] text-ink3">
            <span className="font-medium uppercase tracking-[0.15em] text-ink2">Passage · Pre-departure briefing</span>
            <span>Issued {issued} · valid ~90 days</span>
          </div>
        </div>

        <h1 className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-serif text-[30px] leading-tight text-ink">
          <span className="inline-flex items-center gap-2">
            <span className={`fi fi-${origin.flag}`} /> {origin.name}
          </span>
          <ArrowRight className="h-6 w-6 text-ink3" aria-hidden="true" />
          <span className="inline-flex items-center gap-2">
            <span className={`fi fi-${dest.flag}`} /> {dest.name}
          </span>
        </h1>

        <p className="mt-2 text-[13px] text-ink2">
          Prepared for <span className="text-ink">{audienceLabel}</span> · {factCount} facts ·{' '}
          {brief.updated} updated in the last two years
        </p>

        {/* Lede */}
        <blockquote className="mt-7 border-l-2 border-ink pl-4">
          <p className="font-serif text-[19px] leading-snug text-ink">{brief.lede}</p>
        </blockquote>
        <p className="mt-3 text-[13px] tnum">
          <Count n={counts.critical} tone="text-danger" label="critical" />
          <Dot />
          <Count n={counts.notable} tone="text-warn" label="notable" />
          <Dot />
          <Count n={counts.minor} tone="text-ink2" label="minor" />
          <Dot />
          <Count n={counts.unchanged} tone="text-ink3" label="unchanged" />
        </p>

        {/* Insights */}
        {brief.insights.map((ins, i) => (
          <div key={i} className="mt-6 rounded-[12px] border border-danger/30 bg-danger-bg p-4">
            <p className="flex items-center gap-2 text-[14px] font-medium text-danger">
              <AlertTriangle className="h-4 w-4" /> {ins.title}
            </p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">{ins.text}</p>
          </div>
        ))}

        {/* What changes */}
        <SectionLabel>{aud.length ? 'What changes for you' : 'What changes'}</SectionLabel>
        {brief.changes.length ? (
          <div>
            {brief.changes.map((c) => (
              <DeltaRow key={c.key} change={c} />
            ))}
          </div>
        ) : (
          <p className="border-t border-line pt-4 text-[14px] text-ink2">
            On the facts we track, {dest.name} is broadly similar to {origin.name}.
          </p>
        )}

        {/* Reference facts by cluster */}
        {brief.facts.map((cluster) => (
          <section key={cluster.cluster}>
            <SectionLabel>{cluster.label}</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {cluster.items.map((it) => (
                <FactCard key={it.topic.key} topic={it.topic} claim={it.claim} isFor={it.isFor} />
              ))}
            </div>
          </section>
        ))}

        {/* Checklist */}
        <SectionLabel>Your checklist</SectionLabel>
        <p className="mb-3 text-[13px] text-ink3">Generated from this briefing. Ticking is local to your screen.</p>
        <Checklist items={brief.checklist} />

        {/* Emergency */}
        <div className="mt-8 rounded-[12px] border border-line bg-surface2 p-4">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink2">
            <Phone className="h-4 w-4 text-ink3" />
            <span className="font-medium text-ink">Emergency in {dest.name}:</span>
            <span className="tnum text-danger">{dest.emergency.general}</span>
            <span className="text-ink3">· Police {dest.emergency.police} · Ambulance {dest.emergency.ambulance} · Fire {dest.emergency.fire}</span>
          </p>
        </div>

        {/* Close */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
          <p className="text-[12px] text-ink3">Every fact above is dated and linked. Verify before you travel.</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[13px] text-ink2 transition hover:text-ink"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </article>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <h3 className="mb-3 mt-10 border-b border-line pb-1.5 text-[12px] font-medium uppercase tracking-[0.15em] text-ink3">
      {children}
    </h3>
  )
}

function Count({ n, tone, label }) {
  return (
    <span>
      <span className={`font-semibold ${tone}`}>{n}</span> <span className="text-ink3">{label}</span>
    </span>
  )
}

function Dot() {
  return <span className="px-1.5 text-ink3">·</span>
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-prose px-5 py-20 text-center">
      <h2 className="font-serif text-2xl text-ink">No briefing to show</h2>
      <p className="mt-2 text-ink2">We couldn’t read a valid home and destination from this link.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[15px] font-medium text-canvas hover:opacity-90"
      >
        Start a briefing <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
