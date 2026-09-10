import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B2A2E',
        lagoon: {
          DEFAULT: '#0E7C82',
          deep: '#0A5257',
        },
        turquoise: '#12AA9C',
        coral: {
          DEFAULT: '#FF9E7F',
          deep: '#E67F5C',
        },
        sand: {
          DEFAULT: '#E7D6AC',
          deep: '#C9B27E',
        },
        foam: '#F2FAF8',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
