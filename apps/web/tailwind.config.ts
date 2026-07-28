import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        softPink: '#F8C8DC',
        blush: '#F8C8DC',
        lavender: '#D8C8FF',
        sky: '#CDEBFF',
        textPrimary: '#4B4453',
        surface: '#FFF8FC',
        accent: '#D8C8FF'
      },
      boxShadow: {
        soft: '0 12px 32px rgba(248, 200, 220, 0.18)'
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem'
      }
    }
  },
  plugins: []
};

export default config;
