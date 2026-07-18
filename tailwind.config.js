/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0a',
          raised: '#111111',
          border: '#1f1f1f',
        },
        accent: {
          DEFAULT: '#3b82f6',
        },
        dusky: {
          950: '#0b0314',
          900: '#120824',
          800: '#1c1033',
          700: '#2c1b4d',
          600: '#4a2d7a',
          500: '#6b46a8',
          400: '#a78bda',
          300: '#cbb8ea',
          200: '#e0d4f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};