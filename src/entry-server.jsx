import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'

// Build-time render of a single route to static HTML (see scripts/prerender.mjs).
// renderToStaticMarkup (not renderToString) because the client re-mounts with
// createRoot rather than hydrating — the markup is for crawlers and first paint.
// `location` is the full path incl. base, e.g. "/passage/safe/JP/women".
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function render(location) {
  return renderToStaticMarkup(
    <React.StrictMode>
      <StaticRouter location={location} basename={basename}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  )
}
