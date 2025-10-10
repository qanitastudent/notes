/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            customBg: '#9D8977',
            noteCardBg: '#FDF6F0',
            noteCardHover: '#F5EDE4',
        },
        },
    },
    plugins: [],
}
