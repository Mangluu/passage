import { useState } from 'react'
import { Send, MessageSquareText } from 'lucide-react'
import { ask } from '../lib/ask.js'
import ClaimMeta from './ClaimMeta.jsx'

const EXAMPLES = [
  'Is it safe to be visibly LGBTQ+ here?',
  'Can I get an abortion?',
  'What are the drug laws?',
  'Do I need to register my address?',
]

// The grounded assistant. Deterministic retrieval over the verified claim graph —
// it cites every claim, surfaces live signals, and refuses when it has no verified
// answer. It never generates, so it cannot hallucinate.
export default function AskPanel({ origin, dest, audiences }) {
  const [q, setQ] = useState('')
  const [asked, setAsked] = useState('')
  const [res, setRes] = useState(null)

  function run(text) {
    const question = (text ?? q).trim()
    if (!question) return
    setAsked(question)
    setQ(question)
    setRes(ask({ question, origin, dest, audiences }))
  }

  return (
    <section id="sec-ask" className="card scroll-mt-4 p-5">
      <div className="mb-1 flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-accent" />
        <h3 className="font-serif text-[18px] font-semibold text-ink">Ask Liberty Compass</h3>
      </div>
      <p className="mb-3 text-[11.5px] leading-snug text-ink3">
        Answers only from verified, dated claims — it cites every one and says when it doesn’t know. It never makes
        anything up.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); run() }} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`e.g. "Is it safe to be visibly trans in ${dest.name}?"`}
          className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3 focus:border-ink3 focus:outline-none"
        />
        <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-[13px] font-semibold text-canvas transition hover:opacity-90">
          <Send className="h-4 w-4" /> Ask
        </button>
      </form>

      <div className="mt-2.5 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => run(ex)}
            className="rounded-full border border-line px-3 py-1 text-[12px] text-ink2 transition hover:border-ink3 hover:text-ink"
          >
            {ex}
          </button>
        ))}
      </div>

      {res && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="mb-3 text-[13px] text-ink3">
            You asked: <span className="text-ink2">“{asked}”</span>
          </p>

          {res.refusal ? (
            <div className="rounded-xl border border-warn/30 bg-warn-bg p-3.5">
              <p className="text-[13px] font-semibold text-warn">Not in the verified graph</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{res.refusal}</p>
            </div>
          ) : (
            <>
              <p className="mb-2.5 text-[13px] text-ink2">
                Here’s what’s <span className="font-medium text-ink">verified</span> for {dest.name}:
              </p>
              <div className="flex flex-col gap-3">
                {res.items.map((it) => (
                  <div key={it.key} className="rounded-xl border border-line p-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-medium text-ink">{it.topic.label}</span>
                      {it.fromShort && it.toShort && (
                        <span className="shrink-0 font-mono text-[10px] text-ink3">home: {it.fromShort} → {it.toShort}</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink2">{it.claim.statement}</p>
                    <ClaimMeta claim={it.claim} />
                  </div>
                ))}
              </div>

              {res.signals.length > 0 && (
                <div className="mt-3">
                  <p className="eyebrow mb-1.5">This week</p>
                  <ul className="flex flex-col gap-1.5">
                    {res.signals.map((s, i) => (
                      <li key={i} className="leading-snug">
                        <a href={s.url} target="_blank" rel="noreferrer" className="text-[12.5px] text-accent hover:underline">
                          {s.title}
                        </a>{' '}
                        <span className="font-mono text-[10px] text-ink3">· {s.date} · {s.domain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-3 text-[11.5px] leading-relaxed text-ink3">
                Liberty Compass only answers from its verified graph. For anything not shown, confirm with {dest.name}’s
                consulate or a local organisation — this is not legal advice.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  )
}
