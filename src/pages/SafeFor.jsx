import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Phone, ShieldCheck, ExternalLink } from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import CityHeader from '../components/CityHeader.jsx'
import FactCard from '../components/FactCard.jsx'
import { JURISDICTION_BY_CODE } from '../data/jurisdictions.js'
import { AUDIENCE_BY_ID, AUDIENCES } from '../data/audiences.js'
import { CLUSTERS, topicsForCluster } from '../data/topics.js'
import { profileFor, verdictLine } from '../lib/profile.js'

// "Is {country} safe for {identity}?" — the standalone, shareable page built for
// one destination and one identity. Same data and design system as the briefing,
// but framed as a single question rather than a home→destination comparison.

// Traveller-facing phrasing per audience (the raw labels don't read naturally in
// a sentence — "Woman travellers" / "Person of colour travellers" are off).
const AUD_PHRASE = {
  women: 'women travellers',
  lgbtqi: 'LGBTQI+ travellers',
  disabled: 'disabled travellers',
  religion: 'religious-minority travellers',
  poc: 'travellers of colour',
}

// A few popular destinations for the SEO cross-link rail.
const CROSS_CODES = ['JP', 'TH', 'FR', 'AE', 'US', 'IN', 'BR', 'ZA', 'DE', 'MX']

const TONE_TXT = { danger: 'text-danger', warn: 'text-warn', success: 'text-success', ink3: 'text-ink3' }
const TONE_DOT = { danger: 'bg-danger', warn: 'bg-warn', success: 'bg-success', ink3: 'bg-ink3' }
const TONE_TINT = { danger: 'bg-danger-bg', warn: 'bg-warn-bg', success: 'bg-success-bg', ink3: 'bg-surface2' }
const TIER_LABEL = { 'Broadly safe': 'Broadly safe', 'Mixed — know the gaps': 'Mixed', 'Significant restrictions': 'Restricted' }

export default function SafeFor() {
  const { code, aud } = useParams()
  const cc = (code || '').toUpperCase()
  const country = JURISDICTION_BY_CODE[cc]
  const audience = AUDIENCE_BY_ID[aud]
  const prof = useMemo(() => (country && audience ? profileFor(country, aud) : null), [country, audience, aud])

  if (!country || !audience) return <NotFound />

  const phrase = AUD_PHRASE[aud] || `${audience.label.toLowerCase()} travellers`
  const verdict = verdictLine(country, phrase, prof)
  const e = country.emergency
  const others = AUDIENCES.filter((a) => a.id !== aud)
  const elsewhere = CROSS_CODES.filter((c) => c !== cc && JURISDICTION_BY_CODE[c]).slice(0, 6)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-9">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-ink3">
          <Link to="/" className="hover:text-ink">Passage</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-ink">{country.name}</Link>
          <span>/</span>
          <span className="text-ink2">{audience.label}</span>
        </nav>

        <div className="flex items-center gap-3">
          <span
            className={`fi fi-${country.flag} rounded-[3px] shadow-sm`}
            style={{ width: '2rem', height: '1.5rem', backgroundSize: 'cover' }}
            role="img"
            aria-label={`${country.name} flag`}
          />
          <h1 className="font-serif text-[32px] font-medium leading-[1.08] tracking-tight text-ink sm:text-[40px]">
            Is {country.name} safe for {phrase}?
          </h1>
        </div>

        {/* Verdict band */}
        <section className="card mt-5 flex overflow-hidden">
          <div className={`w-1.5 shrink-0 ${TONE_DOT[prof.tone] || 'bg-ink3'}`} aria-hidden="true" />
          <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-3 p-5">
            <div className="min-w-[240px] flex-1">
              <div className="eyebrow mb-1">The short answer · sourced</div>
              <p className={`font-serif text-[20px] font-semibold leading-snug ${TONE_TXT[prof.tone] || 'text-ink'}`}>
                {prof.tier || 'Not yet assessed'}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">{verdict}</p>
            </div>
            {prof.score != null && (
              <div className="border-line sm:border-l sm:pl-6">
                <div className="eyebrow mb-1">Protection · indicative</div>
                <div className={`font-serif text-[30px] font-semibold leading-none ${TONE_TXT[prof.tone]}`}>
                  {prof.score}
                  <span className="text-[15px] font-normal text-ink3">/100</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left — what to know + full record */}
          <div className="flex min-w-0 flex-col gap-6">
            <section>
              <h2 className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
                What to know as {audience.label === 'Woman' ? 'a woman' : audience.label}
              </h2>
              <p className="eyebrow mb-4 mt-1">the sourced facts that weigh most for you · concerns first</p>
              {prof.items.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {prof.items.map((it) => (
                    <div key={it.key} className={`rounded-xl border border-line p-4 ${TONE_TINT[it.tone] || 'bg-surface2'}`}>
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${TONE_DOT[it.tone] || 'bg-ink3'}`} />
                        <span className="text-[13.5px] font-semibold text-ink">{it.topic.label}</span>
                      </div>
                      <div className="eyebrow mb-1.5 text-[9.5px]">{it.band}</div>
                      <p className="text-[13px] leading-snug text-ink2">{it.claim.statement}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-ink2">
                  We don’t yet hold {phrase}-specific sourced claims for {country.name}. The full record below still applies.
                </p>
              )}
            </section>

            {/* Full sourced record — every claim, grouped, transparent */}
            <section id="record">
              <div className="eyebrow mb-4 border-b border-line pb-2">In detail — every fact, dated &amp; sourced</div>
              <div className="flex flex-col gap-6">
                {CLUSTERS.map((cluster) => {
                  const topics = topicsForCluster(cluster.id).filter((t) => country.claims?.[t.key])
                  if (!topics.length) return null
                  return (
                    <div key={cluster.id}>
                      <h3 className="mb-3 text-[13px] font-medium text-ink2">{cluster.label}</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {topics.map((t) => (
                          <FactCard key={t.key} topic={t} claim={country.claims[t.key]} isFor={t.audiences.includes(aud)} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink3">
                Laws differ from lived experience and this is not legal advice. Each fact shows its evidence type, date and
                source.{' '}
                <Link to="/sources" className="text-accent hover:underline">Full method &amp; sources →</Link>
              </p>
            </section>
          </div>

          {/* Right rail */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                <CityHeader dest={country} />
              </div>
            </div>

            {/* Compare CTA — the page answers "here", the briefing answers "vs home" */}
            <Link
              to={`/briefing?to=${cc}&aud=${aud}`}
              className="card group flex items-center gap-3 p-4 transition hover:border-ink3"
            >
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
              <span className="flex-1 text-[13.5px] leading-snug text-ink2">
                <span className="font-semibold text-ink">Compare with your home country</span> — see exactly what changes when
                you cross the border.
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink3 transition group-hover:translate-x-0.5" />
            </Link>

            {e && (
              <section className="card p-5">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-[17px] font-semibold text-ink">
                  <Phone className="h-4 w-4 text-ink3" /> Emergency numbers
                </h3>
                <div className="flex items-baseline gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  <span className="text-[14px] text-ink2">General</span>
                  <div className="flex-1" />
                  <span className="font-serif text-[24px] font-semibold text-ink tnum">{e.general}</span>
                </div>
                <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3 text-[13px]">
                  <Em l="Police" v={e.police} />
                  <Em l="Ambulance" v={e.ambulance} />
                  <Em l="Fire" v={e.fire} />
                </div>
              </section>
            )}

            {/* Before you go — travel essentials (partner slot). No commission is
                claimed; add affiliate ref codes + a disclosure once partner
                accounts exist. */}
            <section className="rounded-2xl border border-dashed border-accent/40 bg-accent-bg/50 p-4">
              <div className="eyebrow mb-1.5 text-accent">Before you go</div>
              <p className="text-[12.5px] leading-snug text-ink2">
                Travel-medical cover that works abroad with no local address, and a data eSIM so maps and messaging work the
                moment you land.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Partner href="https://safetywing.com/nomad-insurance" label="Travel insurance" />
                <Partner href="https://www.airalo.com/" label="Get an eSIM" />
              </div>
            </section>

            {/* SEO cross-links */}
            <section className="card p-5">
              <div className="eyebrow mb-2.5">Also for {country.name}</div>
              <div className="flex flex-wrap gap-2">
                {others.map((a) => (
                  <Link
                    key={a.id}
                    to={`/safe/${cc}/${a.id}`}
                    className="rounded-lg border border-line px-2.5 py-1 text-[12.5px] text-ink2 transition hover:border-ink3 hover:text-ink"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
              <div className="eyebrow mb-2.5 mt-4">{audience.label} elsewhere</div>
              <div className="flex flex-wrap gap-2">
                {elsewhere.map((c) => (
                  <Link
                    key={c}
                    to={`/safe/${c}/${aud}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[12.5px] text-ink2 transition hover:border-ink3 hover:text-ink"
                  >
                    <span className={`fi fi-${JURISDICTION_BY_CODE[c].flag}`} style={{ width: '1rem', height: '0.75rem' }} />
                    {JURISDICTION_BY_CODE[c].name}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Partner({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-surface px-3 py-1.5 text-[12.5px] font-medium text-accent transition hover:bg-accent-bg"
    >
      {label} <ExternalLink className="h-3 w-3" />
    </a>
  )
}

function Em({ l, v }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink3">{l}</span>
      <span className="font-medium tnum text-ink">{v}</span>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto max-w-prose flex-1 px-6 py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">Page not found</h1>
        <p className="mt-2 text-ink2">We couldn’t find a briefing for that country and identity.</p>
        <Link to="/explore" className="mt-6 inline-flex rounded-lg bg-ink px-5 py-2.5 text-[15px] font-medium text-canvas hover:opacity-90">
          Browse all countries
        </Link>
      </main>
      <Footer />
    </div>
  )
}
