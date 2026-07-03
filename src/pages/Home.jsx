import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { Search, Lock, ShieldQuestion } from 'lucide-react'
import CountrySelect from '../components/CountrySelect.jsx'
import GroupFilter from '../components/GroupFilter.jsx'
import { CLUSTERS } from '../data/aspects.js'

export default function Home() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [groups, setGroups] = useState([])

  const sameCountry = from && to && from === to
  const ready = from && to && !sameCountry

  const toggle = (id) =>
    setGroups((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]))

  function search() {
    if (!ready) return
    const p = new URLSearchParams({ from, to })
    if (groups.length) p.set('groups', groups.join(','))
    navigate(`/dashboard?${p.toString()}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30">
          <Lock className="h-3.5 w-3.5" /> Privacy by design — we store nothing
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Know how <span className="text-brand-600 dark:text-brand-300">liberty & security</span> change when you cross a border
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink2">
          Going on exchange? Pick where you’re coming from, where you’re headed, and the groups that matter to you.
          Passage shows what’s different for <em>you</em> — from sourced, public data.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <CountrySelect id="from" label="I'm coming from" value={from} onChange={setFrom} placeholder="Country of origin" />
          <CountrySelect id="to" label="I'm going to" value={to} onChange={setTo} placeholder="Destination country" />
        </div>

        <div className="mt-5">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink2">
            Which of these apply to you?
            <span className="text-xs font-normal text-ink3">(optional — tailors what’s highlighted)</span>
          </p>
          <GroupFilter selected={groups} onToggle={toggle} />
        </div>

        {sameCountry && (
          <p className="mt-4 text-sm text-amber-600 dark:text-amber-300">Pick two different countries to compare.</p>
        )}

        <button
          type="button"
          onClick={search}
          disabled={!ready}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Search className="h-5 w-5" />
          Show my dashboard
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink3">
          <ShieldQuestion className="h-3.5 w-3.5" />
          No sign-in. Your choices live only in the page URL — nothing is sent to a server or saved.
        </p>
      </div>

      <div className="mt-12">
        <p className="text-center text-sm font-medium uppercase tracking-wide text-ink3">What we cover</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CLUSTERS.map((c) => {
            const Icon = Icons[c.icon] || Icons.Circle
            return (
              <div key={c.id} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-4 text-center shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium leading-tight text-ink2">{c.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
