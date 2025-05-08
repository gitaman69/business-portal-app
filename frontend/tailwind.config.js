
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require(getDaisyUI())],
};
function getDaisyUI() {
  return "daisyui";
}
