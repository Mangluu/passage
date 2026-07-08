import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA — no backend, nothing stored server-side (privacy by design).
// Build uses an absolute base (the GitHub Pages project path) so the
// prerendered nested routes (/safe/xx/women/) resolve their assets correctly;
// dev stays at root so the local server and preview work without a prefix.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/passage/' : '/',
}))
