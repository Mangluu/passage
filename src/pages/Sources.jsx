import { ExternalLink } from 'lucide-react'
import { SOURCES } from '../data/sources.js'
import { AUDIENCES } from '../data/audiences.js'
import { TOPICS } from '../data/topics.js'
import { EVIDENCE_LABEL, CERTAINTY } from '../lib/format.js'
import Tag from '../components/Tag.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function Sources() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-prose flex-1 px-6 py-12">
      <p className="eyebrow">Passage</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">Method &amp; sources</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink2">
        A briefing is only as trustworthy as its weakest fact. Passage is built on{' '}
        <span className="text-ink">claims</span> — each a plain statement carrying its evidence type, the date it
        reflects, its source, and how sure we are. The dashboard’s area scores are honest aggregates of these claims,
        and every one links back to the sourced fact beneath it.
      </p>

      <Section title="How to read a claim">
        <p className="text-[15px] leading-relaxed text-ink2">Every fact is tagged two ways.</p>
        <p className="mt-4 text-[13px] font-medium text-ink2">Evidence type — what kind of thing it is:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(EVIDENCE_LABEL).map(([k, v]) => (
            <Tag key={k} tone="ink2">{v}</Tag>
          ))}
        </div>
        <p className="mt-5 text-[13px] font-medium text-ink2">Certainty — how sure we are:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.values(CERTAINTY).map((c) => (
            <Tag key={c.label} tone={c.tone === 'ink3' ? 'ink3' : c.tone}>{c.label}</Tag>
          ))}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-ink3">
          A statement about the letter of the law is not a promise about lived experience. Where we only have limited
          or anecdotal evidence, we say so rather than dress it up as precision.
        </p>
      </Section>

      <Section title="How severity is decided">
        <ul className="space-y-2.5 text-[15px] leading-relaxed text-ink2">
          <li>
            <Tag tone="danger" className="uppercase tracking-wide">Critical</Tag> — a big change, or anything the
            destination criminalises, enforces or prohibits that is relevant to you.
          </li>
          <li>
            <Tag tone="warn" className="uppercase tracking-wide">Notable</Tag> — a meaningful shift, or a new legal
            duty with a short deadline (address registration, insurance).
          </li>
          <li>
            <Tag tone="ink2" className="uppercase tracking-wide">Minor</Tag> — a smaller difference worth knowing.
          </li>
        </ul>
        <p className="mt-4 text-[14px] leading-relaxed text-ink3">
          Selecting who a briefing is for raises the weight of the topics that matter most to that person, so the same
          facts re-order around you. It never hides anything.
        </p>
      </Section>

      <Section title="Who a briefing is for → what it surfaces">
        <div className="grid gap-3 sm:grid-cols-2">
          {AUDIENCES.map((a) => (
            <div key={a.id} className="rounded-[12px] border border-line bg-surface p-4">
              <h3 className="text-[14px] font-medium text-ink">{a.label}</h3>
              <ul className="mt-2 space-y-1 text-[13px] text-ink2">
                {TOPICS.filter((t) => t.audiences.includes(a.id)).map((t) => (
                  <li key={t.key}>· {t.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sources we rely on">
        <p className="text-[14px] leading-relaxed text-ink3">
          Global datasets are listed below; country-specific legal and official-portal sources are linked inline on
          each claim. Legal facts were cross-checked in an adversarial verification pass against primary and official
          sources.
        </p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {Object.values(SOURCES).map((s) => (
            <li key={s.org} className="flex items-baseline justify-between gap-3 py-2.5">
              <span className="text-[14px] text-ink">
                {s.org} <span className="text-ink3">— {s.name}</span>
              </span>
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-[13px] text-accent hover:underline">
                  Visit <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <p className="mt-10 border-t border-line pt-5 text-[13px] leading-relaxed text-ink3">
        Passage is an informational prototype for B_Hack 2026. Laws and indices are simplified and can be out of date.
        Laws differ from lived experience — this is not legal advice. Always confirm with official government channels
        and your host institution before you travel.
      </p>
      </div>
      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 border-b border-line pb-1.5 text-[12px] font-medium uppercase tracking-[0.15em] text-ink3">
        {title}
      </h2>
      {children}
    </section>
  )
}
