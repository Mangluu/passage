import ClaimMeta from './ClaimMeta.jsx'

// A single fact, shown in the reference sections. Highlighted (heavier border)
// when it's one the reader's audiences care about.
export default function FactCard({ topic, claim, isFor }) {
  return (
    <div className={`rounded-[12px] border bg-surface p-4 ${isFor ? 'border-ink/30' : 'border-line'}`}>
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-[14px] font-medium text-ink">{topic.label}</h4>
        {claim.short && <span className="shrink-0 text-[12px] text-ink3 tnum">{claim.short}</span>}
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">{claim.statement}</p>
      <ClaimMeta claim={claim} />
    </div>
  )
}
