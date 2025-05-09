import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'],       // Only use the light theme
    darkTheme: 'light',      // Override dark mode fallback
    base: true,              // Use base styles
  },
};

export default config;