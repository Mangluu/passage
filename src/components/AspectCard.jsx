import ScoreBar from './ScoreBar.jsx'
import StatusBadge from './StatusBadge.jsx'
import SourceCite from './SourceCite.jsx'

// One data point. Branches on aspect.type; `tags` are the selected groups that
// flagged this aspect as a priority; `highlight` lifts it visually.
export default function AspectCard({ aspect, entry, tags = [], highlight = false }) {
  const showNote = entry?.note && !(aspect.type === 'score' && entry?.value == null)

  return (
    <div
      className={`flex flex-col rounded-xl border p-4 shadow-sm transition ${
        highlight ? 'border-brand-500/40 bg-brand-500/10 ring-1 ring-brand-500/30' : 'border-line bg-surface'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-ink">{aspect.label}</h4>
        {tags.length > 0 && (
          <div className="flex shrink-0 -space-x-1" aria-hidden="true">
            {tags.map((g) => (
              <span
                key={g.id}
                title={`Relevant to ${g.label}`}
                className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${g.accent.solid}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1">
        {aspect.type === 'score' && <ScoreBar aspect={aspect} entry={entry} />}
        {aspect.type === 'status' && <StatusBadge aspect={aspect} entry={entry} />}
        {aspect.type === 'text' && (
          <p className="text-sm leading-relaxed text-ink2">{entry?.text || '—'}</p>
        )}
        {showNote && <p className="mt-2 text-xs leading-relaxed text-ink2">{entry.note}</p>}
      </div>

      <div className="mt-3 flex justify-end border-t border-line pt-2">
        <SourceCite sourceKey={aspect.sourceKey} approx={entry?.approx} />
      </div>
    </div>
  )
}
