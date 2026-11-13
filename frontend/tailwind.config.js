/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Brand purple palette matching the reference screenshot
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      backgroundImage: {
        'page': 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)',
      },
      boxShadow: {
        'card': '0 1px 4px 0 rgba(109, 40, 217, 0.06), 0 4px 24px 0 rgba(109, 40, 217, 0.06)',
        'dept':  '0 2px 8px 0 rgba(109, 40, 217, 0.08), 0 8px 32px 0 rgba(109, 40, 217, 0.08)',
      },
    },
  },
  plugins: [],
}
