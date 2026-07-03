// Small inline label. Tone maps to the semantic role tokens.
const TONE = {
  danger: 'text-danger bg-danger-bg',
  warn: 'text-warn bg-warn-bg',
  success: 'text-success bg-success-bg',
  accent: 'text-accent bg-accent-bg',
  ink2: 'text-ink2 bg-surface2',
  ink3: 'text-ink3 bg-surface2',
}

export default function Tag({ tone = 'ink2', children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${TONE[tone] || TONE.ink2} ${className}`}>
      {children}
    </span>
  )
}
