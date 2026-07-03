import { ExternalLink, ShieldAlert, Info } from 'lucide-react'
import { SOURCES } from '../data/sources.js'
import { GROUPS } from '../data/groups.js'
import { ASPECT_BY_KEY } from '../data/aspects.js'

export default function Sources() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Sources & methodology</h1>
      <p className="mt-2 text-ink2">
        Passage is only as trustworthy as its data, so here is exactly where every number comes from and how we handle
        it.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">Read this first</p>
          <p className="mt-1 leading-relaxed">
            This is an informational prototype for B_Hack 2026. Laws and indices are simplified and may be out of date;
            numeric scores marked “≈” are approximate and should be verified against the linked source.{' '}
            <strong>Laws differ from lived experience, and this is not legal advice.</strong> Always confirm with
            official government channels and your host institution before you travel.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-ink">Data sources</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface2 text-xs uppercase tracking-wide text-ink2">
            <tr>
              <th className="px-4 py-3">Source</th>
              <th className="hidden px-4 py-3 sm:table-cell">Organisation</th>
              <th className="hidden px-4 py-3 md:table-cell">Checked</th>
              <th className="px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {Object.entries(SOURCES).map(([key, s]) => (
              <tr key={key} className="align-top">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{s.name}</div>
                  <div className="text-xs text-ink3 sm:hidden">{s.org}</div>
                  <div className="mt-0.5 text-xs text-ink3">{s.license}</div>
                </td>
                <td className="hidden px-4 py-3 text-ink2 sm:table-cell">{s.org}</td>
                <td className="hidden px-4 py-3 text-ink2 md:table-cell">{s.retrieved}</td>
                <td className="px-4 py-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-brand-600 dark:text-brand-300 hover:underline"
                  >
                    Visit <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-ink">How groups map to aspects</h2>
      <p className="mt-1 text-sm text-ink2">
        Ticking a group never hides anything — it lifts and highlights that group’s most-relevant aspects.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <div key={g.id} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <h3 className={`font-semibold ${g.accent.text}`}>{g.label}</h3>
            <ul className="mt-2 space-y-1 text-sm text-ink2">
              {g.priorityAspects.map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${g.accent.solid}`} />
                  {ASPECT_BY_KEY[k]?.label || k}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-ink">How the comparison works</h2>
      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink2 shadow-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500 dark:text-brand-400" />
        <div className="space-y-2">
          <p>
            Every comparable aspect is normalised to a 0–100 “freedom / safety” score, so indices on different scales
            (a 1–4 travel advisory, a 0–10 restriction index, a 0–100 rights index) can be compared on one axis.
          </p>
          <p>
            The “What changes vs. home” panel then diffs your origin against your destination and ranks the biggest
            differences, surfacing the aspects your selected groups care about first. Red means more restrictive at
            your destination; green means freer.
          </p>
          <p className="text-ink3">
            Categorical facts (marriage equality, criminalisation, treaty ratifications) reflect the letter of the law.
            Qualitative summaries are compiled from public government and NGO reporting.
          </p>
        </div>
      </div>
    </div>
  )
}
