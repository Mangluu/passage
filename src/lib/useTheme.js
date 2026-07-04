import { useSyncExternalStore } from 'react'

// Shared theme store. The <html> `.dark` class (set pre-paint by the inline
// script in index.html) is the single source of truth, so every useTheme()
// consumer stays in sync when the theme is toggled. Persisted locally (theme
// preference only — not personal data).

const listeners = new Set()

function currentTheme() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'
}

function setTheme(next) {
  document.documentElement.classList.toggle('dark', next === 'dark')
  try {
    localStorage.setItem('liberty-compass-theme', next)
  } catch (e) {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'light')
  const toggle = () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark')
  return { theme, toggle }
}
