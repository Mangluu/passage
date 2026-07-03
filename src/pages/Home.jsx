import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CountrySelect from '../components/CountrySelect.jsx'
import AudienceSelect from '../components/AudienceSelect.jsx'

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
    <div className="mx-auto max-w-prose px-5 py-12 sm:py-16">
      <p className="text-[12px] uppercase tracking-[0.2em] text-ink3">Passage</p>
      <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink sm:text-[44px]">
        Before you go, know what changes.
      </h1>
      <p className="mt-5 text-[18px] leading-relaxed text-ink2">
        A pre-departure briefing for exchange students: how liberty and security differ between home and your
        destination — sourced, dated, and specific to who you are. Not a country score. A document you can read,
        check, and take with you.
      </p>

      <div className="mt-10 border-t border-line pt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <CountrySelect id="from" label="Home" value={from} onChange={setFrom} placeholder="Where you're coming from" />
          <CountrySelect id="to" label="Destination" value={to} onChange={setTo} placeholder="Where you're going" />
        </div>

        <div className="mt-6">
          <p className="mb-2.5 text-[13px] font-medium text-ink2">
            This briefing is for…{' '}
            <span className="font-normal text-ink3">optional — it re-weights what comes first</span>
          </p>
          <AudienceSelect selected={aud} onToggle={toggle} />
        </div>

        {sameCountry && <p className="mt-4 text-[13px] text-warn">Choose two different countries to compare.</p>}

        <button
          type="button"
          onClick={go}
          disabled={!ready}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-canvas transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Prepare briefing
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-[12px] text-ink3">
          Assembled in your browser. Nothing about you is stored or sent to a server.
        </p>
      </div>
    </div>
  )
}
