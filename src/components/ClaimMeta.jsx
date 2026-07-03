import { ExternalLink } from 'lucide-react'
import { EVIDENCE_LABEL, CERTAINTY, yearOf } from '../lib/format.js'
import { resolveSource } from '../data/sources.js'
import Tag from './Tag.jsx'

// The provenance line under every claim: evidence type · date · source · certainty.
// This is the trust surface — it appears on every fact, no exceptions.
export default function ClaimMeta({ claim }) {
  const s = resolveSource(claim.src)
  const cert = CERTAINTY[claim.cert] || CERTAINTY.limited
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink3">
      <span className="font-medium text-ink2">{EVIDENCE_LABEL[claim.ev] || 'Claim'}</span>
      <span>· as of {yearOf(claim.asOf)}</span>
      <span aria-hidden="true">·</span>
      {s.url ? (
        <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-accent hover:underline">
          {s.org}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span>{s.org}</span>
      )}
      <Tag tone={cert.tone === 'ink3' ? 'ink3' : cert.tone}>{cert.label}</Tag>
    </div>
  )
}
