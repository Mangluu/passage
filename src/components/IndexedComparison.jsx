import { ExternalLink, Info, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  INDICES, DOMAIN_KEYS, indexView, overallIndex, domainScores, topChanges, tierLabel, tone,
} from '../lib/world.js'
import { advisoryFor } from '../lib/signals.js'
import CityHeader from './CityHeader.jsx'
import SignalsPanel from './SignalsPanel.jsx'
import EntryPanel from './EntryPanel.jsx'

const BAR = { success: 'bg-success', warn: 'bg-warn', danger: 'bg-danger', ink3: 'bg-ink3' }
const TXT = { success: 'text-success', warn: 'text-warn', danger: 'text-danger', ink2: 'text-ink2', ink3: 'text-ink3' }
const CHIP = { success: 'text-success bg-success-bg', danger: 'text-danger bg-danger-bg', ink2: 'text-ink2 bg-surface2' }
const ADV_BADGE = { success: 'bg-success-bg text-success', warn: 'bg-warn-bg text-warn', danger: 'bg-danger-bg text-danger' }

// The Indexed briefing — shown whenever at least one country isn't curated. It
// mirrors the curated briefing's structure (hero, standing, what-changes, detail)
// but is built entirely from the published indices we hold for both countries,
// each dated and linked. Honest by construction: auto-assembled, not hand-verified.
export default function IndexedComparison({ oInfo, dInfo, aud = [] }) {
  const dOverall = overallIndex(dInfo)
  const oOverall = overallIndex(oInfo)
  const delta = dOverall != null && oOverall != null ? dOverall - oOverall : null
  const destTone = tone(dOverall)
  const adv = advisoryFor(dInfo.code)
  const changes = topChanges(oInfo, dInfo)
  const dDomains = domainScores(dInfo)
  const oDomainMap = Object.fromEntries(domainScores(oInfo).map((d) => [d.id, d.score]))

  const rel =
    delta == null ? { text: `Home: ${oInfo.name}`, cls: 'text-ink2' }
      : Math.abs(delta) < 5 ? { text: 'About the same as home', cls: 'text-ink2' }
        : delta > 0 ? { text: `${delta} pts higher than home`, cls: 'text-success' }
          : { text: `${-delta} pts lower than home`, cls: 'text-danger' }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-5">
      {/* Auto-assembled banner */}
      <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-accent/25 bg-accent-bg px-3.5 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <span className="text-[12.5px] leading-snug text-ink2">
          <span className="font-semibold text-ink">Indexed briefing.</span> Auto-assembled from published datasets for{' '}
          {dInfo.name} — every figure below is dated and linked, but this isn’t yet hand-verified like our{' '}
          <Link to="/explore" className="text-accent hover:underline">curated countries</Link>. Laws differ from lived
          experience; not legal advice.
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Hero */}
          <section className="card overflow-hidden">
            <div className="relative flex aspect-[16/9] max-h-[380px] items-end overflow-hidden p-5">
              <CityHeader dest={dInfo} />
              <div className="relative z-10 flex items-center gap-3">
                <span className={`fi fi-${dInfo.flag} rounded-[3px] shadow-md`} style={{ width: '2.4rem', height: '1.8rem', backgroundSize: 'cover' }} role="img" aria-label={`${dInfo.name} flag`} />
                <h2 className="font-serif text-[30px] font-semibold leading-none text-ink">{dInfo.name}</h2>
              </div>
              {adv && (
                <span className={`absolute right-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ADV_BADGE[adv.tone]}`} title="US State Dept advisory">
                  Advisory Lvl {adv.level}
                </span>
              )}
            </div>
            <div className="flex flex-wrap border-t border-line">
              <Cell label="Overall standing" value={dOverall != null ? `${dOverall}/100 · ${tierLabel(dOverall)}` : '—'} valueClass={TXT[destTone]} border />
              <Cell label={`vs. ${oInfo.name} (home)`} value={rel.text} valueClass={rel.cls} border />
              <Cell label="US advisory" value={adv ? `Level ${adv.level}` : '—'} valueClass={adv ? TXT[adv.tone] : 'text-ink2'} />
            </div>
          </section>

          {/* Standing by area */}
          {dDomains.length > 0 && (
            <section className="card p-5">
              <h3 className="mb-1 flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-ink3" /> Standing by area
              </h3>
              <p className="eyebrow mb-4">normalised so higher = better · tick marks {oInfo.name} (home)</p>
              <div className="flex flex-col gap-3.5">
                {dDomains.map((d) => (
                  <AreaBar key={d.id} label={d.label} score={d.score} homeScore={oDomainMap[d.id]} />
                ))}
              </div>
            </section>
          )}

          {/* What changes most */}
          {changes.length > 0 && (
            <section className="card p-5">
              <h3 className="font-serif text-[18px] font-semibold text-ink">What changes most</h3>
              <p className="eyebrow mb-4 mt-1">{oInfo.name} → {dInfo.name}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {changes.map((c) => (
                  <div key={c.key} className={`rounded-xl border border-line p-3.5 ${c.gap > 0 ? 'bg-success-bg' : 'bg-danger-bg'}`}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink">{c.meta.short}</span>
                      <span className={`shrink-0 text-[11px] font-medium ${c.gap > 0 ? 'text-success' : 'text-danger'}`}>
                        {c.gap > 0 ? 'Better here' : 'Worse here'}
                      </span>
                    </div>
                    <p className="font-mono text-[11.5px] text-ink2">
                      {c.home.display} <span className="text-ink3">({oInfo.name})</span> → {c.dest.display} <span className="text-ink3">({dInfo.name})</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="flex min-w-0 flex-col gap-5">
          <EntryPanel origin={oInfo} dest={dInfo} />
          <SignalsPanel dest={dInfo} audiences={aud} />
        </div>
      </div>

      {/* In detail — every index, home vs destination */}
      <div className="scroll-mt-4 pt-6">
        <div className="eyebrow mb-4 border-b border-line pb-2">In detail — every index, dated &amp; sourced</div>
        <div className="flex flex-col gap-6">
          {DOMAIN_KEYS.map((d) => {
            const rows = d.keys.filter((k) => oInfo.values[k] || dInfo.values[k])
            if (!rows.length) return null
            return (
              <section key={d.id}>
                <div className="eyebrow mb-2.5 text-accent">{d.label}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {rows.map((k) => <IndexCompareCard key={k} k={k} oInfo={oInfo} dInfo={dInfo} />)}
                </div>
              </section>
            )
          })}
        </div>

        <p className="mt-8 border-t border-line pt-5 text-[12px] leading-relaxed text-ink3">
          These are published index values, machine-ingested and dated — not the per-claim legal verification a curated
          briefing carries, and identity filters don’t change them. Bars are normalised so longer = better regardless of
          the metric’s direction.{' '}
          <Link to="/explore" className="text-accent hover:underline">Browse all countries</Link>{' · '}
          <Link to="/sources" className="text-accent hover:underline">method &amp; sources</Link>.
        </p>
      </div>
    </div>
  )
}

function AreaBar({ label, score, homeScore }) {
  const t = tone(score)
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[13px] text-ink2">{label}</span>
        <span className={`font-mono text-[12px] font-semibold ${TXT[t]}`}>{score}<span className="text-ink3">/100 · {tierLabel(score)}</span></span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-surface2">
        <div className={`h-full rounded-full ${BAR[t]}`} style={{ width: `${score}%` }} />
        {homeScore != null && (
          <span className="absolute top-0 h-full w-0.5 bg-ink/70" style={{ left: `${homeScore}%` }} title={`home ${homeScore}`} />
        )}
      </div>
    </div>
  )
}

function IndexCompareCard({ k, oInfo, dInfo }) {
  const meta = INDICES[k]
  const home = indexView(oInfo, k)
  const dst = indexView(dInfo, k)
  const dn = home && dst ? dst.norm - home.norm : null
  const chip = dn == null ? null
    : Math.abs(dn) < 6 ? { text: 'About the same', tone: 'ink2' }
      : dn > 0 ? { text: `Better in ${dInfo.name}`, tone: 'success' }
        : { text: `Worse in ${dInfo.name}`, tone: 'danger' }
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[14px] font-semibold text-ink">{meta.short}</h4>
          <p className="mt-0.5 text-[11px] leading-snug text-ink3">{meta.note}</p>
        </div>
        {chip && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${CHIP[chip.tone]}`}>{chip.text}</span>}
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        <CompareRow info={oInfo} v={home} muted />
        <CompareRow info={dInfo} v={dst} />
      </div>
      <a href={meta.url} target="_blank" rel="noreferrer" className="mt-2.5 inline-flex items-center gap-1 text-[10.5px] text-accent hover:underline">
        {meta.org} <ExternalLink className="h-2.5 w-2.5" />
      </a>
      <span className="ml-1 font-mono text-[9.5px] text-ink3">via {meta.via}</span>
    </div>
  )
}

function CompareRow({ info, v, muted }) {
  const t = muted ? 'ink3' : v ? v.tone : 'ink3'
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className={`fi fi-${info.flag} shrink-0`} />
          <span className="truncate text-[12px] text-ink2">{info.name}</span>
        </span>
        {v ? (
          <span className="shrink-0 font-mono text-[11.5px] tnum">
            <span className={`font-semibold ${TXT[muted ? 'ink2' : v.tone]}`}>{v.display}</span>
            <span className="text-ink3"> · {v.asOf}</span>
          </span>
        ) : (
          <span className="shrink-0 font-mono text-[10.5px] text-ink3">no data</span>
        )}
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface2">
        {v && <div className={`h-full rounded-full ${BAR[t]}`} style={{ width: `${v.norm}%` }} />}
      </div>
    </div>
  )
}

function Cell({ label, value, valueClass = 'text-ink', border }) {
  return (
    <div className={`min-w-[130px] flex-1 p-4 ${border ? 'border-r border-line' : ''}`}>
      <div className="eyebrow mb-1.5 text-[10px]">{label}</div>
      <div className={`text-[15px] font-semibold ${valueClass}`}>{value}</div>
    </div>
  )
}
