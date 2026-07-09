import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import CountrySelect from '../components/CountrySelect.jsx'
import AudienceSelect from '../components/AudienceSelect.jsx'
import { COUNTRY_COUNT } from '../lib/world.js'
import { JURISDICTION_BY_CODE } from '../data/jurisdictions.js'

const FEATURES = [
  ['01', 'For anyone crossing a border — travellers, students and people relocating.'],
  ['02', 'Every figure links to a public, named source. No black boxes.'],
  ['03', 'Nothing about you is saved. We never ask who you are.'],
]

// Discovery + internal-linking strips that feed crawlers into the prerendered
// /safe/<code>/<aud> pages — one row per live identity vertical.
const DISCOVERY = [
  { aud: 'women', heading: 'women', codes: ['JP', 'TH', 'IN', 'AE', 'MX', 'MA', 'EG', 'IT'] },
  { aud: 'lgbtqi', heading: 'LGBTQ+ travellers', codes: ['TH', 'JP', 'US', 'AE', 'RU', 'TR', 'DE', 'BR'] },
  { aud: 'disabled', heading: 'disabled travellers', codes: ['JP', 'DE', 'US', 'ES', 'TH', 'FR', 'GB', 'IT'] },
  { aud: 'religion', heading: 'religious minorities', codes: ['SA', 'FR', 'IN', 'CN', 'TR', 'ID', 'US', 'DE'] },
]

export default function Home() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [aud, setAud] = useState([])

  const sameCountry = from && to && from === to
  const ready = from && to && !sameCountry
  const toggle = (id) => setAud((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))

  function go() {
    if (!ready) return
    const p = new URLSearchParams({ from, to })
    if (aud.length) p.set('aud', aud.join(','))
    navigate(`/briefing?${p.toString()}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div>
          <div className="eyebrow mb-5">Safety &amp; rights, before you go</div>
          <h1 className="font-serif text-[42px] font-medium leading-[1.05] tracking-tight text-ink sm:text-[54px]">
            Know how your rights change the moment you cross the border.
          </h1>
          <p className="mt-5 max-w-[480px] text-[16.5px] leading-relaxed text-ink2">
            Pick where you’re coming from and where you’re heading. Passage compares how rights, safety, health
            and everyday life differ between the two — and surfaces what matters for who you are.
          </p>
          <div className="mt-7 flex max-w-[460px] flex-col gap-3">
            {FEATURES.map(([n, t]) => (
              <div key={n} className="flex gap-3">
                <span className="mt-0.5 min-w-[18px] font-mono text-[11px] text-ink3">{n}</span>
                <span className="text-[14px] leading-snug text-ink2">{t}</span>
              </div>
            ))}
          </div>
          <Link
            to="/explore"
            className="group mt-7 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent transition hover:gap-2.5"
          >
            Or browse all {COUNTRY_COUNT} countries, indexed
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="card p-7">
          <div className="eyebrow mb-4">Compare two countries</div>
          <div className="mb-3.5">
            <CountrySelect id="from" label="I am travelling from" value={from} exclude={to} onChange={setFrom} placeholder="Country of origin" />
          </div>
          <div className="mb-4">
            <CountrySelect id="to" label="I plan to go to" value={to} exclude={from} onChange={setTo} placeholder="Search for a country" />
          </div>
          <div className="eyebrow mb-2.5">
            Read it for who you are <span className="text-ink3/70">— pick any that apply</span>
          </div>
          <AudienceSelect selected={aud} onToggle={toggle} />
          {sameCountry && <p className="mt-3 text-[12px] text-accent">Pick two different countries to compare.</p>}
          <button
            type="button"
            onClick={go}
            disabled={!ready}
            className="mt-6 w-full rounded-xl bg-ink px-5 py-3.5 text-[15px] font-semibold text-canvas transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Compare countries
          </button>
          <p className="mt-3.5 text-center text-[11px] leading-relaxed text-ink3">
            Assembled in your browser — nothing about you is stored or sent to a server.
          </p>
        </div>
      </main>
      <PopularBriefings />
      <Footer />
    </div>
  )
}

function PopularBriefings() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="eyebrow mb-1.5">Popular briefings</div>
        <p className="mb-6 max-w-[560px] text-[14px] leading-relaxed text-ink2">
          Sourced, dated safety &amp; rights briefings — one per country, read for who you are. More destinations are added
          as the data is verified.
        </p>
        <div className="flex flex-col gap-5">
          {DISCOVERY.map(({ aud, heading, codes }) => (
            <div key={aud}>
              <div className="mb-2 text-[12.5px] font-medium text-ink">Is it safe for {heading}?</div>
              <div className="flex flex-wrap gap-2">
                {codes.map((code) => {
                  const c = JURISDICTION_BY_CODE[code]
                  if (!c) return null
                  return (
                    <Link
                      key={code}
                      to={`/safe/${code}/${aud}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink2 transition hover:border-accent hover:text-ink"
                    >
                      <span className={`fi fi-${c.flag}`} style={{ width: '1rem', height: '0.75rem' }} aria-hidden="true" />
                      {c.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
