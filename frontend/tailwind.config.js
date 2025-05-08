/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "base-100": "#ffffff",  // White background for base
          "base-content": "#000000", // Black text color
        },
      },
    ],
  },
  plugins: [require('daisyui'),],
}
