/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './hooks/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#7C61FF',
        blush: '#F4D7F3',
        softPink: '#FFF0F7',
        textPrimary: '#1F1F2C',
      },
      boxShadow: {
        soft: '0 25px 60px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
