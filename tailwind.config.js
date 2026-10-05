/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#714B67',
          darkPurple: '#4A3144',
          teal: '#00A09D',
          lightTeal: '#E6F6F6',
          bg: '#F8FAF9',
          card: '#FFFFFF',
          accent: '#714B67',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
