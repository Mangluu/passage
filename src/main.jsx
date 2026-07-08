import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import 'flag-icons/css/flag-icons.min.css'

// Real paths (not hash) so every route is a distinct, crawlable URL — the build
// prerenders one static HTML file per route (see scripts/prerender.mjs).
// `basename` tracks Vite's base: /passage in the deployed build, empty in dev.
// createRoot cleanly replaces any prerendered static markup with the live app.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
