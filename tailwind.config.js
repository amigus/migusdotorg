/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    theme: {
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem',
        },
      },
      fontFamily: {
        monospace: ['Fira Mono', 'monospace'],
        sans: ['Lato', 'sans-serif'],
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