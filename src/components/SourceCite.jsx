import { ExternalLink } from 'lucide-react'
import { sourceFor } from '../data/sources.js'

// Tiny attribution link shown on every data card.
export default function SourceCite({ sourceKey, approx }) {
  const s = sourceFor(sourceKey)
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noreferrer"
      title={`${s.name} — ${s.org} (checked ${s.retrieved})`}
      className="inline-flex items-center gap-1 text-[11px] text-ink3 transition-colors hover:text-brand-600"
    >
      {approx && (
        <span title="Approximate — verify against the source" className="font-semibold">
          ≈
        </span>
      )}
      <span className="max-w-[9rem] truncate">{s.org}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  )
}
