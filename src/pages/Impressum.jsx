import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

// Lightweight about & contact page for a personal, non-commercial project.
export default function Impressum() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-prose flex-1 px-6 py-12">
        <p className="eyebrow">Liberty Compass</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">About &amp; contact</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink2">
          Liberty Compass is a personal, non-commercial project. Here’s who maintains it and how to get in touch.
        </p>

        <Block title="Who runs this">
          <Line l="Maintainer" v="Shivang Gupta" />
          <Line
            l="Email"
            v={<a href="mailto:shivangzephyr@gmail.com" className="text-accent hover:underline">shivangzephyr@gmail.com</a>}
          />
        </Block>

        <Block title="Nature of this site">
          <p className="text-[14px] leading-relaxed text-ink2">
            Liberty Compass is a personal, non-commercial project. It provides general, sourced information and is{' '}
            <span className="text-ink">not legal advice</span>. No goods or services are sold and no payment is processed.
          </p>
        </Block>

        <Block title="Liability for content">
          <p className="text-[14px] leading-relaxed text-ink3">
            As a service provider we are responsible for our own content on these pages under general law. However, we
            are not obliged to monitor transmitted or stored third-party information. Information is provided in good
            faith; every figure is sourced and dated, but laws and circumstances change — always confirm with official
            authorities before acting.
          </p>
        </Block>

        <Block title="Liability for links">
          <p className="text-[14px] leading-relaxed text-ink3">
            Our pages link to external sources. We have no influence over their content and accept no liability for it;
            responsibility lies with the respective operator. See the{' '}
            <a href="#/sources" className="text-accent hover:underline">Sources</a> page for the links we use.
          </p>
        </Block>
      </div>
      <Footer />
    </div>
  )
}

function Block({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 border-b border-line pb-1.5 text-[12px] font-medium uppercase tracking-[0.15em] text-ink3">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Line({ l, v }) {
  return (
    <p className="flex flex-wrap gap-x-3 py-0.5 text-[14px]">
      {l && <span className="min-w-[92px] text-ink3">{l}</span>}
      <span className="text-ink2">{v}</span>
    </p>
  )
}
