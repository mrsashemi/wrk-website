/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      spacing: {
        '76': '19rem',
        '128': '32rem',
        '136': '40rem',
        '144': '48rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
