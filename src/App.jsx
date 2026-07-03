import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Briefing from './pages/Briefing.jsx'
import Sources from './pages/Sources.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/briefing" element={<Briefing />} />
          <Route path="/dashboard" element={<Navigate to="/briefing" replace />} />
          <Route path="/sources" element={<Sources />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
