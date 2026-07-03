import { ArrowRight } from 'lucide-react'
import Tag from './Tag.jsx'
import ClaimMeta from './ClaimMeta.jsx'
import { TIER } from '../lib/format.js'

// Literal classes so Tailwind keeps them (no dynamic string building).
const DIR_CLASS = { restrictive: 'text-danger', freer: 'text-success', same: 'text-ink2' }

// One entry in "what changes for you": a position delta or a new duty.
export default function DeltaRow({ change }) {
  const { topic, tier, direction, kind, from, to, claim, isFor } = change
  const tierInfo = TIER[tier] || TIER.minor
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-4 border-t border-line py-4 sm:grid-cols-[6.5rem_1fr]">
      <div>
        <Tag tone={kind === 'duty' ? 'warn' : tierInfo.tone} className="uppercase tracking-wide">
          {kind === 'duty' ? 'New duty' : tierInfo.label}
        </Tag>
      </div>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h4 className="font-medium text-ink">{topic.label}</h4>
          {isFor && <span className="text-[11px] text-accent">· for you</span>}
        </div>

        {kind === 'position' ? (
          <div className="mt-1.5 flex items-center gap-2 text-[13px] tnum">
            <span className="text-ink3">{from}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink3" aria-hidden="true" />
            <span className={`font-medium ${DIR_CLASS[direction] || 'text-ink'}`}>{to}</span>
          </div>
        ) : (
          <div className="mt-1.5 text-[13px] text-ink2">
            Required · <span className="text-ink">{claim.timing}</span>
          </div>
        )}

        <p className="mt-1.5 text-[15px] leading-relaxed text-ink2">{claim.statement}</p>
        <ClaimMeta claim={claim} />
      </div>
    </div>
  )
}
