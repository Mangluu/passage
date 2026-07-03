import { useSearchParams, Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ArrowLeftRight, MapPin, Search } from 'lucide-react'
import { COUNTRY_BY_CODE } from '../data/countries.js'
import { CLUSTERS, aspectsForCluster } from '../data/aspects.js'
import { relevantAspectKeys, groupsForAspect, GROUP_BY_ID } from '../data/groups.js'
import CountrySelect from '../components/CountrySelect.jsx'
import GroupFilter from '../components/GroupFilter.jsx'
import DeltaStrip from '../components/DeltaStrip.jsx'
import ClusterRadar from '../components/ClusterRadar.jsx'
import EmergencyBox from '../components/EmergencyBox.jsx'
import AspectCard from '../components/AspectCard.jsx'

export default function Dashboard() {
  const [params, setParams] = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const groups = (params.get('groups') || '').split(',').filter(Boolean)
  const origin = COUNTRY_BY_CODE[from]
  const dest = COUNTRY_BY_CODE[to]

  function update(patch) {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    setParams(p, { replace: true })
  }
  const toggleGroup = (id) => {
    const s = new Set(groups)
    s.has(id) ? s.delete(id) : s.add(id)
    update({ groups: [...s].join(',') })
  }

  if (!origin || !dest) return <EmptyState />

  const relevant = relevantAspectKeys(groups)
  const clusterRelevance = (c) => aspectsForCluster(c.id).filter((a) => relevant.has(a.key)).length
  const orderedClusters = [...CLUSTERS].sort((a, b) => clusterRelevance(b) - clusterRelevance(a))

  return (
    <div>
      {/* Controls: change countries / groups without leaving the dashboard */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-2">
            <div className="w-36 sm:w-44">
              <CountrySelect id="from" label="From" value={from} onChange={(c) => update({ from: c })} />
            </div>
            <button
              type="button"
              onClick={() => update({ from: to, to: from })}
              title="Swap origin & destination"
              className="mb-1 rounded-lg border border-line p-2 text-ink2 transition hover:bg-surface2"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <div className="w-36 sm:w-44">
              <CountrySelect id="to" label="To" value={to} onChange={(c) => update({ to: c })} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <GroupFilter selected={groups} onToggle={toggleGroup} />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-300 hover:bg-brand-500/10"
            >
              <Search className="h-4 w-4" /> New search
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-center gap-2 text-sm text-ink2">
          <MapPin className="h-4 w-4 text-brand-500 dark:text-brand-400" />
          Studying in
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <span className={`fi fi-${dest.flag}`} /> {dest.name}
          </span>
          <span className="text-ink3">·</span>
          coming from
          <span className="inline-flex items-center gap-1.5 font-medium text-ink2">
            <span className={`fi fi-${origin.flag}`} /> {origin.name}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <DeltaStrip origin={origin} dest={dest} selectedIds={groups} />
            {orderedClusters.map((cluster) => (
              <ClusterSection
                key={cluster.id}
                cluster={cluster}
                dest={dest}
                groups={groups}
                relevant={relevant}
              />
            ))}
          </div>

          <aside className="space-y-6 self-start lg:sticky lg:top-4">
            <ClusterRadar origin={origin} dest={dest} />
            <EmergencyBox country={dest} />
            <GroupSummary groups={groups} />
          </aside>
        </div>
      </div>
    </div>
  )
}

function ClusterSection({ cluster, dest, groups, relevant }) {
  const Icon = Icons[cluster.icon] || Icons.Circle
  // Group-relevant aspects float to the top of the cluster.
  const aspects = [...aspectsForCluster(cluster.id)].sort(
    (a, b) => (relevant.has(a.key) ? 0 : 1) - (relevant.has(b.key) ? 0 : 1),
  )
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface2 text-ink2">
          <Icon className="h-4 w-4" />
        </span>
        {cluster.label}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {aspects.map((a) => {
          const tags = groupsForAspect(a.key, groups)
          return (
            <AspectCard
              key={a.key}
              aspect={a}
              entry={dest.aspects[a.key]}
              tags={tags}
              highlight={tags.length > 0}
            />
          )
        })}
      </div>
    </section>
  )
}

function GroupSummary({ groups }) {
  if (!groups.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-4 text-sm text-ink2 shadow-sm">
        Tip: tick the groups that apply to you on the bar above to highlight what matters most for you.
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <h3 className="font-semibold text-ink">Tailored for you</h3>
      <p className="mt-1 text-xs text-ink3">Cards marked with these dots are prioritised.</p>
      <div className="mt-3 flex flex-col gap-2">
        {groups.map((id) => {
          const g = GROUP_BY_ID[id]
          if (!g) return null
          const Icon = Icons[g.icon] || Icons.Circle
          return (
            <span key={id} className="inline-flex items-center gap-2 text-sm text-ink2">
              <span className={`h-2.5 w-2.5 rounded-full ${g.accent.solid}`} />
              <Icon className="h-4 w-4 text-ink3" />
              {g.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400">
        <MapPin className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-xl font-bold text-ink">Pick a route to begin</h2>
      <p className="mt-2 text-ink2">
        We couldn’t read a valid origin and destination from this link. Start a new search to build your dashboard.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-700"
      >
        <Search className="h-5 w-5" /> Go to search
      </Link>
    </div>
  )
}
