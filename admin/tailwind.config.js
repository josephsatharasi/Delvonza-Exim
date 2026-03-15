/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9ee',
          100: '#fef3d7',
          200: '#fce4ae',
          300: '#f9cf7a',
          400: '#f6b044',
          500: '#f39520',
          600: '#e47816',
          700: '#bd5914',
          800: '#974618',
          900: '#7a3b16',
        },
      },
    },
  },
  plugins: [],
}
