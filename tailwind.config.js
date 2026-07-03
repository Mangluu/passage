/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens backed by CSS variables (see src/index.css).
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        ink2: 'rgb(var(--c-ink2) / <alpha-value>)',
        ink3: 'rgb(var(--c-ink3) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        'danger-bg': 'rgb(var(--c-danger-bg) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
        'warn-bg': 'rgb(var(--c-warn-bg) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        'success-bg': 'rgb(var(--c-success-bg) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-bg': 'rgb(var(--c-accent-bg) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'Segoe UI', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 3px 26px rgba(33, 31, 27, 0.05)',
        pop: '0 12px 34px rgba(33, 31, 27, 0.16)',
      },
      maxWidth: {
        prose: '46rem',
      },
    },
  },
  plugins: [],
}
