/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tomato: {
          50: '#fff1f0',
          100: '#ffe1de',
          200: '#ffc8c4',
          300: '#ffa199',
          400: '#f86f63',
          500: '#e54335', // Primary warm tomato
          600: '#d02b1d',
          700: '#af2014',
          800: '#901d14',
          900: '#771d17',
          950: '#410b07',
        },
        cheese: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        crust: {
          50: '#fbf7ee',
          100: '#f5ecd6',
          200: '#ebd7ab',
          300: '#dec079',
          400: '#cfa64c',
          500: '#bc8c33',
          600: '#a16f28',
          700: '#805322',
          800: '#694320', // Toasted brown
          900: '#58381d',
          950: '#321d0d',
        },
        warmbg: {
          50: '#fdfbf7',
          100: '#fbf7f0',
          200: '#f6ede0',
          300: '#efe0cd',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(208, 43, 29, 0.15)',
        'warm-lg': '0 20px 40px -15px rgba(120, 53, 15, 0.2)',
      }
    },
  },
  plugins: [],
}
