/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem',
        },
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      extend: {}
    },
    plugins: [],
  }