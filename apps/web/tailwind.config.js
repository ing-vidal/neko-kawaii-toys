/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './hooks/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#D8C8FF',
        blush: '#F8C8DC',
        softPink: '#F8C8DC',
        textPrimary: '#4B4453',
        sky: '#CDEBFF',
        lavender: '#D8C8FF',
        surface: '#FFF8FC'
      },
      boxShadow: {
        soft: '0 12px 32px rgba(248, 200, 220, 0.18)',
      },
    },
  },
  plugins: [],
};
