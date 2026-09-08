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
        emergency: {
          red: '#ef4444',
          'red-dark': '#b91c1c',
          'red-glow': 'rgba(239, 68, 68, 0.25)',
          orange: '#f97316',
          amber: '#f59e0b',
          yellow: '#eab308',
          green: '#10b981',
          cyan: '#06b6d4',
          blue: '#0284c7',
        },
        slate: {
          950: '#070b13',
          900: '#0b1120',
          850: '#10182b',
          800: '#1e293b',
          700: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(239, 68, 68, 0.4)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.35)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-rapid': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
