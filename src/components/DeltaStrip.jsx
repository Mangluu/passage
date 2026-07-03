import { ArrowRight, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react'
import { meaningfulChanges } from '../lib/compare.js'
import { valueLabel } from '../lib/format.js'

// The hero: "what changes vs home". Most restrictive & group-relevant first.
export default function DeltaStrip({ origin, dest, selectedIds, limit = 9 }) {
  if (!origin || !dest) return null

  if (origin.code === dest.code) {
    return (
      <Shell origin={origin} dest={dest}>
        <p className="text-sm text-ink2">
          You’ve picked the same country for home and destination. Choose a different destination to see what changes.
        </p>
      </Shell>
    )
  }

  const changes = meaningfulChanges(origin, dest, selectedIds)
  const restrictive = changes.filter((c) => c.direction === 'restrictive')
  const freer = changes.filter((c) => c.direction === 'freer')

  if (changes.length === 0) {
    return (
      <Shell origin={origin} dest={dest}>
        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
          On the aspects we track, {dest.name} is broadly similar to {origin.name}.
        </div>
      </Shell>
    )
  }

  const shown = changes.slice(0, limit)
  const more = changes.length - shown.length

  return (
    <Shell
      origin={origin}
      dest={dest}
      summary={
        <>
          <strong className="text-ink">{changes.length}</strong> aspects differ —{' '}
          <span className="font-semibold text-red-600 dark:text-red-400">{restrictive.length} more restrictive</span>,{' '}
          <span className="font-semibold text-emerald-600">{freer.length} freer</span> than {origin.name}.
        </>
      }
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => {
          const restrictiveDir = c.direction === 'restrictive'
          const Icon = restrictiveDir ? TrendingDown : TrendingUp
          return (
            <div
              key={c.key}
              className={`rounded-xl border p-3 ${
                restrictiveDir ? 'border-red-500/30 bg-red-500/10' : 'border-emerald-500/30 bg-emerald-500/10'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`h-4 w-4 shrink-0 ${restrictiveDir ? 'text-red-500' : 'text-emerald-600'}`} />
                <span className="text-sm font-semibold text-ink">{c.aspect.label}</span>
                {c.groupRelevant && (
                  <span className="ml-auto rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                    for you
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink2">
                <span>{valueLabel(c.aspect, origin.aspects[c.key])}</span>
                <ArrowRight className="h-3 w-3 shrink-0 text-ink3" />
                <span className="font-medium text-ink">{valueLabel(c.aspect, dest.aspects[c.key])}</span>
              </div>
            </div>
          )
        })}
      </div>
      {more > 0 && (
        <p className="mt-3 text-xs text-ink3">+{more} more differences shown in the sections below.</p>
      )}
    </Shell>
  )
}

function Shell({ origin, dest, summary, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            What changes vs. {origin.name}
            <span className="text-ink3">·</span>
            <span className="flex items-center gap-1.5 text-ink2">
              <span className={`fi fi-${dest.flag}`} /> {dest.name}
            </span>
          </h2>
          {summary && <p className="mt-0.5 text-sm text-ink2">{summary}</p>}
        </div>
        <div className="flex items-center gap-3 text-xs text-ink2">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> more restrictive
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> freer
          </span>
        </div>
      </header>
      {children}
    </section>
  )
}
