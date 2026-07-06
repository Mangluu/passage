import { Plane, ExternalLink } from 'lucide-react'
import { visaFor, VISA_SOURCE } from '../lib/visa.js'

const DOT = { success: 'bg-success', warn: 'bg-warn', danger: 'bg-danger' }
const TXT = { success: 'text-success', warn: 'text-warn', danger: 'text-danger' }

// "Getting in" — the one pairwise fact: what a home passport needs to enter the
// destination. origin/dest each need { code, name }.
export default function EntryPanel({ origin, dest }) {
  const v = visaFor(origin.code, dest.code)
  if (!v) return null
  return (
    <section className="card p-5">
      <div className="mb-2 flex items-center gap-2">
        <Plane className="h-4 w-4 text-accent" />
        <h3 className="font-serif text-[18px] font-semibold text-ink">Getting in</h3>
      </div>
      <p className="text-[12.5px] text-ink3">
        A <span className="text-ink2">{origin.name}</span> passport, entering{' '}
        <span className="text-ink2">{dest.name}</span>:
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT[v.tone]}`} />
        <span className={`text-[16px] font-semibold ${TXT[v.tone]}`}>{v.label}</span>
        {v.detail && <span className="text-[13px] text-ink2">· up to {v.detail}</span>}
      </div>
      <a
        href={VISA_SOURCE.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-accent hover:underline"
      >
        Passport Index <ExternalLink className="h-3 w-3" />
      </a>
      <span className="ml-1 font-mono text-[10px] text-ink3">· {VISA_SOURCE.license} · check official rules before you travel</span>
    </section>
  )
}
