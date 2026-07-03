// A single segmented bar of the real change counts — no invented composite.
export default function SeverityMeter({ counts }) {
  const { critical, notable, minor, unchanged } = counts
  const total = critical + notable + minor + unchanged || 1
  const seg = (n, cls) => (n > 0 ? <span className={cls} style={{ width: `${(n / total) * 100}%` }} /> : null)

  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full" role="img" aria-label={`${critical} critical, ${notable} notable, ${minor} minor, ${unchanged} unchanged`}>
        {seg(critical, 'bg-danger')}
        {seg(notable, 'bg-warn')}
        {seg(minor, 'bg-ink3')}
        {seg(unchanged, 'bg-line')}
      </div>
      <p className="mt-2 text-[13px] tnum">
        <span className="font-semibold text-danger">{critical} critical</span>
        <span className="px-1.5 text-ink3">·</span>
        <span className="font-semibold text-warn">{notable} notable</span>
        <span className="px-1.5 text-ink3">·</span>
        <span className="text-ink2">{minor} minor</span>
        <span className="px-1.5 text-ink3">·</span>
        <span className="text-ink3">{unchanged} unchanged</span>
      </p>
    </div>
  )
}
