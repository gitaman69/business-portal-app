import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in-out": "fadeInOut 3s ease-in-out",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: 0, transform: "translateY(10px)" },
          "10%, 90%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // Only use the light theme
    darkTheme: "light", // Override dark mode fallback
    base: true, // Use base styles
  },
};

export default config;
