/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tech: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
          600: '#2c3e50',
          500: '#3b4252',
          400: '#4b5563',
          300: '#64748b',
          200: '#94a3b8',
          100: '#e5e7eb',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#a78bfa',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'code': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        tech: '0 4px 24px 0 rgba(6,182,212,0.08)',
      },
    },
  },
  plugins: [],
} 