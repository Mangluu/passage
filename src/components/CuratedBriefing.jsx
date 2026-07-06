import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Scale, Flag, ShieldCheck, Phone } from 'lucide-react'
import { AUDIENCE_BY_ID } from '../data/audiences.js'
import { buildBrief } from '../lib/brief.js'
import { areaScores, overallScore, advisoryCards, scoreTone, tipFrom } from '../lib/dashboard.js'
import { CLUSTER_ICON } from '../lib/icons.js'
import ScoreRows from './ScoreRows.jsx'
import OverallScale from './OverallScale.jsx'
import CityHeader from './CityHeader.jsx'
import FactCard from './FactCard.jsx'
import Checklist from './Checklist.jsx'

const TONE_TXT = { danger: 'text-danger', warn: 'text-warn', success: 'text-success', ink3: 'text-ink3' }
const TONE_DOT = { danger: 'bg-danger', warn: 'bg-warn', success: 'bg-success' }
const TONE_TINT = { danger: 'bg-danger-bg', warn: 'bg-warn-bg', success: 'bg-success-bg' }

// The full, hand-verified briefing — shown only when BOTH countries are curated
// (Tier A). Everything here assumes the rich per-claim data model in
// jurisdictions.js; indexed-only countries take the IndexedComparison path.
export default function CuratedBriefing({ origin, dest, aud, jump }) {
  const brief = useMemo(() => buildBrief(origin, dest, aud), [origin, dest, aud])
  if (!brief) return null

  const areas = areaScores(origin, dest)
  const oOverall = overallScore(origin)
  const dOverall = overallScore(dest)
  const destTone = scoreTone(dOverall.avg)
  const advisories = advisoryCards(brief)
  const audienceLabel = aud.map((id) => AUDIENCE_BY_ID[id]?.label).filter(Boolean).join(' · ')
  const e = dest.emergency

  const delta = dOverall.avg != null && oOverall.avg != null ? dOverall.avg - oOverall.avg : null
  const rel =
    delta == null
      ? { text: `Home: ${origin.name}`, cls: 'text-ink' }
      : Math.abs(delta) < 6
        ? { text: 'About the same as home', cls: 'text-ink2' }
        : delta > 0
          ? { text: `${delta} pts freer than home`, cls: 'text-success' }
          : { text: `${-delta} pts more restricted`, cls: 'text-danger' }

  return (
    <>
      {/* Honesty banner */}
      <div className="px-5 pt-4">
        <div className="flex items-start gap-2.5 rounded-lg border border-accent/25 bg-accent-bg px-3.5 py-2.5">
          <span className="eyebrow mt-0.5 shrink-0 text-accent">Note</span>
          <span className="text-[12.5px] leading-snug text-ink2">
            Area scores use published indices where one exists and an indicative band otherwise — hover any score to
            see the sourced facts behind it. Laws differ from lived experience; this is not legal advice.
          </span>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid gap-5 px-5 py-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          <section id="sec-overview" className="card scroll-mt-4 overflow-hidden">
            <div className="relative flex aspect-[16/9] max-h-[440px] items-end overflow-hidden p-5">
              <CityHeader dest={dest} />
              <div className="relative z-10 flex items-center gap-3">
                <span
                  className={`fi fi-${dest.flag} rounded-[3px] shadow-md`}
                  style={{ width: '2.4rem', height: '1.8rem', backgroundSize: 'cover' }}
                  role="img"
                  aria-label={`${dest.name} flag`}
                />
                <h2 className="font-serif text-[32px] font-semibold leading-none text-ink">{dest.name}</h2>
              </div>
            </div>
            <div className="flex flex-wrap border-t border-line">
              <Cell
                label="Overall protection"
                value={`${dOverall.avg}/100 · ${dOverall.tier}`}
                valueClass={TONE_TXT[destTone]}
                title={`Overall protection — ${dOverall.avg}/100\n\n${tipFrom(dOverall.breakdown)}`}
                border
              />
              <Cell label={`vs. ${origin.name} (home)`} value={rel.text} valueClass={rel.cls} border />
              <Cell label="Emergency" value={e.general} />
            </div>
          </section>

          <section className="card p-6">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <h3 className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
                <Scale className="h-4 w-4 text-ink3" /> Overall position
              </h3>
            </div>
            <p className="eyebrow mb-6">where each country sits on the liberty &amp; security scale</p>
            <OverallScale origin={origin} dest={dest} originScore={oOverall.avg} destScore={dOverall.avg} />
          </section>

          <section id="sec-adv" className="card scroll-mt-4 p-6">
            <h3 className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
              <Flag className="h-4 w-4 text-ink3" /> {aud.length ? 'Advisories for you' : 'Key changes'}
            </h3>
            <p className="eyebrow mb-4 mt-1">{aud.length ? `flagged for ${audienceLabel}` : `${origin.name} → ${dest.name}`}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {advisories.map((a) => (
                <div key={a.key} className={`rounded-xl border border-line p-3.5 ${TONE_TINT[a.tone] || 'bg-surface2'}`}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${TONE_DOT[a.tone] || 'bg-ink3'}`} />
                    <span className="text-[13px] font-semibold text-ink">{a.title}</span>
                  </div>
                  <div className="eyebrow mb-1.5 text-[9.5px]">{a.sub}</div>
                  <p className="text-[12.5px] leading-snug text-ink2">{a.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex min-w-0 flex-col gap-5">
          <section id="sec-scores" className="card scroll-mt-4 p-5">
            <div className="mb-1.5 flex items-baseline justify-between">
              <h3 className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-ink3" /> How protected each area is
              </h3>
              <span className="text-[11px] text-ink3">/ 100</span>
            </div>
            <p className="mb-5 text-[11.5px] leading-snug text-ink3">
              Higher = more protected. The tick marks {origin.name} (home), so you can see the gap at a glance.
            </p>
            <ScoreRows rows={areas} onJump={() => jump('sec-sources')} />
          </section>

          <section className="rounded-2xl bg-ink p-5 text-canvas">
            <div className="eyebrow mb-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              In summary
            </div>
            <div className="font-serif text-[20px] font-semibold leading-tight text-canvas">
              {origin.name} <span style={{ opacity: 0.55 }}>→</span> {dest.name}
            </div>
            <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-canvas">{brief.lede}</p>
          </section>

          <section id="sec-emergency" className="card scroll-mt-4 p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
                <Phone className="h-4 w-4 text-ink3" /> Quick info
              </h3>
              <span className="eyebrow">{dest.name}</span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="text-[14px] text-ink2">Emergency</span>
              <div className="flex-1" />
              <span className="font-serif text-[24px] font-semibold text-ink">{e.general}</span>
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3 text-[13px]">
              <EmLine l="Police" v={e.police} />
              <EmLine l="Ambulance" v={e.ambulance} />
              <EmLine l="Fire" v={e.fire} />
            </div>
          </section>
        </div>
      </div>

      {/* Detail — the sourced record */}
      <div id="sec-sources" className="scroll-mt-4 px-5 pb-4">
        <div className="eyebrow mb-4 border-b border-line pb-2">In detail — every fact, dated &amp; sourced</div>
        {brief.facts.map((cluster) => {
          const ClusterIcon = CLUSTER_ICON[cluster.cluster] || Flag
          return (
            <section key={cluster.cluster} className="mb-6">
              <h4 className="mb-3 flex items-center gap-2 text-[13px] font-medium text-ink2">
                <ClusterIcon className="h-4 w-4 text-ink3" /> {cluster.label}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cluster.items.map((it) => (
                  <FactCard key={it.topic.key} topic={it.topic} claim={it.claim} isFor={it.isFor} />
                ))}
              </div>
            </section>
          )
        })}

        <div className="mb-6">
          <h4 className="mb-1 text-[13px] font-medium text-ink2">Your checklist</h4>
          <p className="mb-3 text-[12px] text-ink3">Generated from this briefing. Ticking is local to your screen.</p>
          <Checklist items={brief.checklist} />
        </div>

        <p className="border-t border-line pt-4 text-[12px] leading-relaxed text-ink3">
          Area scores use published indices where one exists (freedom of expression, government restriction of
          religion) and an indicative band for categorical facts — hover any score for its basis. Each fact shows its
          evidence type, date and source; legal facts were cross-checked against primary sources.{' '}
          <Link to="/sources" className="text-accent hover:underline">
            Full method &amp; sources →
          </Link>
        </p>
      </div>
    </>
  )
}

function Cell({ label, value, valueClass = 'text-ink', border, title }) {
  return (
    <div title={title} className={`min-w-[130px] flex-1 p-4 ${border ? 'border-r border-line' : ''}`}>
      <div className="eyebrow mb-1.5 text-[10px]">{label}</div>
      <div className={`text-[15px] font-semibold ${valueClass}`}>{value}</div>
    </div>
  )
}

function EmLine({ l, v }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink3">{l}</span>
      <span className="font-medium tnum text-ink">{v}</span>
    </div>
  )
}
