/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e',
        primary: '#e94560',
        accent: '#0f3460',
        text: '#eaeaea',
        gold: '#f5a623',
        green: '#2ecc71'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      }
    },
  },
  plugins: [],
}
