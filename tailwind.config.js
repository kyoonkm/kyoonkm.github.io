/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundCream: '#FFFFFF',
        textGrayCustom: '#4A4A4A',
      },
    },
  },
  plugins: [],
}

