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
          300: '#774936',
          400: '#8a5a44',
          500: '#E6CCB2',
          600: '#432818',
          700: '#6f1d1b',
          800: '#B08968',
          900: '#7F5539',
        },
      },
    },
  },
  plugins: [],
}
