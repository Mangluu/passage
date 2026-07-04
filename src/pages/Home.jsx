import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import CountrySelect from '../components/CountrySelect.jsx'
import AudienceSelect from '../components/AudienceSelect.jsx'

const FEATURES = [
  ['01', 'Built for marginalised students — the differences that most affect you.'],
  ['02', 'Every figure links to a public, named source. No black boxes.'],
  ['03', 'Nothing about you is saved. We never ask who you are.'],
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
          <div className="eyebrow mb-5">Liberty &amp; security, before you go</div>
          <h1 className="font-serif text-[42px] font-medium leading-[1.05] tracking-tight text-ink sm:text-[54px]">
            Know how your rights change the moment you cross the border.
          </h1>
          <p className="mt-5 max-w-[480px] text-[16.5px] leading-relaxed text-ink2">
            Pick where you’re coming from and where you’re heading. Liberty Compass compares how liberty and security differ
            between the two — across health, law, expression, safety and more — and surfaces what matters for who you are.
          </p>
          <div className="mt-7 flex max-w-[460px] flex-col gap-3">
            {FEATURES.map(([n, t]) => (
              <div key={n} className="flex gap-3">
                <span className="mt-0.5 min-w-[18px] font-mono text-[11px] text-ink3">{n}</span>
                <span className="text-[14px] leading-snug text-ink2">{t}</span>
              </div>
            ))}
          </div>
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
            Prioritise information about <span className="text-ink3/70">— optional, multiple ok</span>
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
      <Footer />
    </div>
  )
}
