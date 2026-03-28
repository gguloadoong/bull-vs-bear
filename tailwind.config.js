/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0A0E1A',
          800: '#0D1426',
          700: '#111B35',
          600: '#1A2644',
        },
        'lime': {
          400: '#A8FF3E',
          500: '#7EE800',
        },
        'gold': {
          400: '#FFD166',
          500: '#F5A623',
        },
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0A0E1A 0%, #111B35 50%, #0D1426 100%)',
      },
    },
  },
  plugins: [],
}
