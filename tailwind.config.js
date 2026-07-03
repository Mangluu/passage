/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens backed by CSS variables (see src/index.css). Warm,
        // paper-neutral in light; warm near-black in dark. Components use
        // bg-surface / text-ink / border-line etc. — never raw slate/indigo.
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        ink2: 'rgb(var(--c-ink2) / <alpha-value>)',
        ink3: 'rgb(var(--c-ink3) / <alpha-value>)',
        // Severity / semantic roles.
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
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
      },
      maxWidth: {
        prose: '46rem',
      },
    },
  },
  plugins: [],
}
