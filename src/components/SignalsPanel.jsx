import { ExternalLink, Radio } from 'lucide-react'
import { signalsFor } from '../lib/signals.js'

const TONE_TXT = { danger: 'text-danger', warn: 'text-warn', success: 'text-success', ink3: 'text-ink3' }
const TONE_DOT = { danger: 'bg-danger', warn: 'bg-warn', success: 'bg-success', ink3: 'bg-ink3' }

// "What changed recently" for a destination — the freshness layer. Works for any
// country (advisory) with identity-routed news for the curated set. These are
// things to check, not verified facts.
export default function SignalsPanel({ dest, audiences = [] }) {
  const { advisory, news, isFor, generatedAt } = signalsFor(dest.code, audiences)
  const advTone = advisory ? advisory.tone : 'ink3'

  return (
    <section id="sec-signals" className="card scroll-mt-4 p-5">
      <div className="mb-1 flex items-center gap-2">
        <Radio className="h-4 w-4 text-accent" />
        <h3 className="font-serif text-[18px] font-semibold text-ink">Live signals</h3>
      </div>
      <p className="mb-4 text-[11.5px] leading-snug text-ink3">
        Recent, dated signals for {dest.name}{generatedAt ? ` (as of ${generatedAt})` : ''} — things to{' '}
        <span className="text-ink2">check</span>, not verified facts.
      </p>

      {advisory ? (
        <a
          href={advisory.link}
          target="_blank"
          rel="noreferrer"
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-line bg-surface2 p-3 transition hover:border-ink3"
        >
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${TONE_DOT[advTone]}`} />
          <span className="min-w-0">
            <span className={`text-[13px] font-semibold ${TONE_TXT[advTone]}`}>
              Level {advisory.level} · {advisory.label}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[10px] text-ink3">
              US State Department{advisory.date ? ` · ${advisory.date}` : ''} ↗
            </span>
          </span>
        </a>
      ) : (
        <p className="mb-4 text-[12.5px] text-ink3">No US State Department advisory on record for {dest.name}.</p>
      )}

      {news.length ? (
        <ul className="flex flex-col divide-y divide-line">
          {news.map((n, i) => (
            <li key={i} className="py-2.5 first:pt-0">
              <a href={n.url} target="_blank" rel="noreferrer" className="group block">
                <div className="flex items-start gap-2">
                  {isFor(n) && <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" title="Relevant to you" />}
                  <span className="text-[13px] leading-snug text-ink transition group-hover:text-accent">{n.title}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-ink3">
                  <span>{n.date || ''}</span>
                  <span>·</span>
                  <span className="truncate">{n.domain}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12.5px] leading-snug text-ink3">
          No recent identity-specific news surfaced for {dest.name} this cycle. Absence of news is not evidence of
          safety — check the advisory and official sources.
        </p>
      )}
    </section>
  )
}
