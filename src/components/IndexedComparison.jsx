import { ArrowRight, ExternalLink, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { INDICES, DOMAIN_KEYS, indexView } from '../lib/world.js'
import SignalsPanel from './SignalsPanel.jsx'

const BAR = { success: 'bg-success', warn: 'bg-warn', danger: 'bg-danger', ink3: 'bg-ink3' }
const TXT = { success: 'text-success', warn: 'text-warn', danger: 'text-danger', ink2: 'text-ink2' }
const CHIP = {
  success: 'text-success bg-success-bg',
  danger: 'text-danger bg-danger-bg',
  ink2: 'text-ink2 bg-surface2',
}

// The Tier B comparison — shown whenever at least one country isn't curated. It
// compares the published indices we hold for BOTH countries, grouped by domain,
// each dated and linked, and is explicit that this is not the full briefing.
// "Better/worse" is judged on the normalised goodness, so lower-is-better metrics
// (homicide) read correctly.
export default function IndexedComparison({ oInfo, dInfo, aud = [] }) {
  const uncurated = [oInfo, dInfo].filter((c) => !c.curated).map((c) => c.name)
  const curatedOne = [oInfo, dInfo].find((c) => c.curated)

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6">
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-accent/25 bg-accent-bg px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p className="text-[13px] leading-relaxed text-ink2">
          <span className="font-semibold text-ink">Indexed comparison.</span> We don’t yet have a full hand-verified
          briefing for {listNames(uncurated)}. Here’s how {oInfo.name} and {dInfo.name} compare on the published
          indices we hold for both — each dated and linked below.
          {curatedOne && (
            <> {curatedOne.name} does have a full briefing; pick two ★ countries to see the complete comparison.</>
          )}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <CountryTag info={oInfo} role="home" />
        <ArrowRight className="h-5 w-5 shrink-0 text-ink3" aria-hidden="true" />
        <CountryTag info={dInfo} role="destination" />
      </div>

      {/* One section per domain */}
      <div className="flex flex-col gap-6">
        {DOMAIN_KEYS.map((d) => {
          const rows = d.keys.filter((k) => oInfo.values[k] || dInfo.values[k])
          if (!rows.length) return null
          return (
            <section key={d.id}>
              <div className="eyebrow mb-2.5 text-accent">{d.label}</div>
              <div className="flex flex-col gap-3">
                {rows.map((k) => <IndexCompareCard key={k} k={k} oInfo={oInfo} dInfo={dInfo} />)}
              </div>
            </section>
          )
        })}
      </div>

      {/* Freshness layer for the destination */}
      <div className="mt-6">
        <SignalsPanel dest={dInfo} audiences={aud} />
      </div>

      <div className="mt-8 border-t border-line pt-5 text-[12px] leading-relaxed text-ink3">
        These are published index values, machine-ingested and dated — not the per-claim legal verification a curated
        briefing carries, and identity filters don’t change them. Bars are normalised so longer = better regardless of
        the metric’s direction. A value’s year is the year the source reflects.{' '}
        <Link to="/explore" className="text-accent hover:underline">Browse all countries</Link>{' · '}
        <Link to="/sources" className="text-accent hover:underline">method &amp; sources</Link>. Laws differ from lived
        experience; this is not legal advice.
      </div>
    </div>
  )
}

function IndexCompareCard({ k, oInfo, dInfo }) {
  const meta = INDICES[k]
  const home = indexView(oInfo, k)
  const dst = indexView(dInfo, k)
  const dn = home && dst ? dst.norm - home.norm : null
  const chip =
    dn == null
      ? null
      : Math.abs(dn) < 6
        ? { text: 'About the same', tone: 'ink2' }
        : dn > 0
          ? { text: `Better in ${dInfo.name}`, tone: 'success' }
          : { text: `Worse in ${dInfo.name}`, tone: 'danger' }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-[16px] font-semibold text-ink">{meta.short}</h3>
          <p className="mt-0.5 text-[11.5px] leading-snug text-ink3">{meta.note}</p>
        </div>
        {chip && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${CHIP[chip.tone]}`}>{chip.text}</span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <CompareRow info={oInfo} v={home} muted />
        <CompareRow info={dInfo} v={dst} />
      </div>

      <a href={meta.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] text-accent hover:underline">
        {meta.org} <ExternalLink className="h-3 w-3" />
      </a>
      <span className="ml-1 font-mono text-[10px] text-ink3">via {meta.via}</span>
    </div>
  )
}

function CompareRow({ info, v, muted }) {
  const tone = muted ? 'ink3' : v ? v.tone : 'ink3'
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className={`fi fi-${info.flag} shrink-0`} />
          <span className="truncate text-[13px] text-ink2">{info.name}</span>
        </span>
        {v ? (
          <span className="shrink-0 font-mono text-[12px] tnum">
            <span className={`font-semibold ${TXT[muted ? 'ink2' : v.tone]}`}>{v.display}</span>
            <span className="text-ink3"> · {v.asOf}</span>
          </span>
        ) : (
          <span className="shrink-0 font-mono text-[11px] text-ink3">no data</span>
        )}
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface2">
        {v && <div className={`h-full rounded-full ${BAR[tone]}`} style={{ width: `${v.norm}%` }} />}
      </div>
    </div>
  )
}

function CountryTag({ info, role }) {
  return (
    <span className="flex items-center gap-2">
      <span className="eyebrow w-[74px] shrink-0">{role}</span>
      <span className={`fi fi-${info.flag}`} style={{ width: '1.6rem', height: '1.2rem' }} />
      <span className="font-serif text-[20px] font-semibold text-ink">{info.name}</span>
      {info.curated && <span className="rounded bg-accent-bg px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-accent">Curated</span>}
    </span>
  )
}

function listNames(names) {
  if (!names.length) return 'this pairing'
  if (names.length === 1) return names[0]
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
