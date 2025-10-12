/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffedd8',
          100: '#f3d5b5',
          200: '#d4a276',
          300: '#bc8a5f',
          400: '#a47148',
          500: '#e7bc91',
          600: '#8b5e34',
          700: '#603808',
          800: '#ffe6a7',
          900: '#432818',
        },
      },
    },
  },
  plugins: [],
}
