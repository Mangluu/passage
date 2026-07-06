import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Briefing from './pages/Briefing.jsx'
import Explore from './pages/Explore.jsx'
import Sources from './pages/Sources.jsx'
import Impressum from './pages/Impressum.jsx'
import Privacy from './pages/Privacy.jsx'

// Home & Sources carry their own top masthead + footer; Briefing is a full
// sidebar dashboard with its own chrome.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/briefing" element={<Briefing />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/dashboard" element={<Navigate to="/briefing" replace />} />
      <Route path="/sources" element={<Sources />} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  )
}
