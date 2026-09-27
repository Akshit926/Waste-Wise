/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede7',
          200: '#c5dcd1',
          300: '#9bc2b3',
          400: '#6ea391',
          500: '#4a8573',
          600: '#386a5b',
          700: '#2d5449',
          800: '#1b4332',
          900: '#143628',
          950: '#0b1f17',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e4',
          200: '#c7d0c9',
          300: '#a4b3a7',
          400: '#819385',
          500: '#647768',
          600: '#4e5e52',
          700: '#3f4c42',
          800: '#343e37',
          900: '#2b332d',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          card: '#FFFFFF',
          muted: '#F1F3F4',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'drawer': '-4px 0 24px -2px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
