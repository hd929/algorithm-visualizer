/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#090d16',
          850: '#0f172a',
          800: '#141e33',
          750: '#1a2742',
          700: '#1e293b',
          600: '#334155',
        },
        cyber: {
          blue: '#38bdf8',
          cyan: '#06b6d4',
          emerald: '#10b981',
          purple: '#a855f7',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
      }
    },
  },
  plugins: [],
}
