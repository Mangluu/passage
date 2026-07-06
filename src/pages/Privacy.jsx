import { ExternalLink } from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-prose flex-1 px-6 py-12">
        <p className="eyebrow">Liberty Compass</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">Privacy notice</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink2">
          Liberty Compass is built to know as little about you as possible — but honesty matters more than a slogan, so here is
          exactly what happens, including the parts that are out of our hands.
        </p>

        <Block title="What Liberty Compass collects about you — nothing">
          <ul className="space-y-2 text-[15px] leading-relaxed text-ink2">
            <li>· No account, no sign-in, no profile.</li>
            <li>· No cookies, no analytics, no advertising, no tracking pixels.</li>
            <li>
              · Your home country, destination and prioritised topics live only in the page’s URL, in your browser.
              They are never sent to us or stored on a server. If you copy the link, those choices travel in it — so
              only share it if you mean to.
            </li>
            <li>· Your light/dark theme is remembered in your browser’s local storage. It never leaves your device.</li>
          </ul>
        </Block>

        <Block title="Hosting — GitHub Pages (what we can’t control)">
          <p className="text-[15px] leading-relaxed text-ink2">
            This site is hosted on <span className="text-ink">GitHub Pages</span> and delivered via the Fastly CDN.
            When your browser requests the site, GitHub’s servers automatically receive and log technical data —
            including your <span className="text-ink">IP address</span>, browser/user-agent, referrer and the files
            requested — to deliver the pages and protect the service. This processing is done by GitHub, Inc., not by
            us; we do not receive, see, or control these logs.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Ext href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</Ext>
            <Ext href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">GitHub Pages data collection</Ext>
          </div>
        </Block>

        <Block title="Web fonts — self-hosted">
          <p className="text-[15px] leading-relaxed text-ink2">
            All typefaces are <span className="text-ink">served from this site itself</span>, not from Google Fonts or
            any other third party. Your browser never contacts <span className="font-mono text-[13px]">fonts.googleapis.com</span>{' '}
            or <span className="font-mono text-[13px]">fonts.gstatic.com</span>, so Google receives no request and no IP
            address when the page loads. There are no external scripts, stylesheets, images or trackers of any kind — the
            only network request your browser makes is to the host below to fetch the page.
          </p>
        </Block>

        <Block title="Your rights">
          <p className="text-[14px] leading-relaxed text-ink3">
            Because we hold no personal data about you, there is nothing on our side to access, correct, export or
            delete. For host-level server logs, the controller is GitHub — see their statement above. For any question
            about this site, contact the maintainer on the{' '}
            <a href="#/impressum" className="text-accent hover:underline">About</a> page.
          </p>
        </Block>

        <p className="mt-10 border-t border-line pt-5 text-[12px] leading-relaxed text-ink3">
          This is a personal, non-commercial project; this notice is provided in good faith and is not legal advice.
          Last reviewed: July 2026.
        </p>
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

function Ext({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[12px] text-accent hover:border-ink3"
    >
      {children} <ExternalLink className="h-3 w-3" />
    </a>
  )
}
