import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        softPink: '#FFD6E8',
        blush: '#FFB8D4',
        lavender: '#CDB4FF',
        sky: '#DCF5FF',
        textPrimary: '#1F1F2C',
        surface: '#FFFFFF',
        accent: '#7C61FF'
      },
      boxShadow: {
        soft: '0 18px 40px rgba(31, 31, 44, 0.08)'
      },
      borderRadius: {
        xl: '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;
