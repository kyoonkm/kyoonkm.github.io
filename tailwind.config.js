/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundCream: '#FAF9F6',
        textGrayCustom: '#4A4A4A',
      },
    },
  },
  plugins: [],
}

