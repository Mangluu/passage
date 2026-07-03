import { OBLIGATION_TOPICS } from '../data/topics.js'

const ACTION = {
  residence_registration: 'register address',
  health_insurance: 'insurance',
  student_work: 'work rules',
  medication_import: 'medicines',
}

// A deadline rail built from the destination's real arrival obligations.
export default function ArrivalTimeline({ dest, onJump }) {
  const mid = OBLIGATION_TOPICS.map((t) => ({ t, c: dest.claims[t.key] }))
    .filter((x) => x.c && x.c.required && x.c.deadlineDays != null)
    .sort((a, b) => a.c.deadlineDays - b.c.deadlineDays)
    .map((x) => ({ label: `Day ${x.c.deadlineDays}`, sub: ACTION[x.t.key] || x.t.label, urgent: x.c.deadlineDays <= 14 }))

  const nodes = [{ label: 'Before you go', sub: 'insurance · embassy', urgent: false }, ...mid, { label: 'Settling in', sub: '', urgent: false }]
  const off = 50 / nodes.length

  return (
    <button type="button" onClick={onJump} className="block w-full text-left" title="Jump to the checklist">
      <div className="relative">
        <div className="absolute top-[6px] h-[2px] bg-surface2" style={{ left: `${off}%`, right: `${off}%` }} />
        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` }}>
          {nodes.map((nd, i) => (
            <div key={i} className="px-1 text-center">
              <span className={`inline-block h-3 w-3 rounded-full ${nd.urgent ? 'bg-danger' : 'bg-ink3'}`} />
              <div className={`mt-1.5 text-[12px] leading-tight ${nd.urgent ? 'font-medium text-danger' : 'text-ink2'}`}>
                {nd.label}
                {nd.sub && (
                  <>
                    <br />
                    <span className="text-[11px] font-normal text-ink3">{nd.sub}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </button>
  )
}
