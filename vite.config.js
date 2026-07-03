import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA — no backend, nothing stored server-side (privacy by design).
export default defineConfig({
  plugins: [react()],
  base: './',
})
