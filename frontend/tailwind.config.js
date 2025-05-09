import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'],
  },
};

export default config;