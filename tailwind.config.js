/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        planeFly: {
          '0%': {
            transform: 'translateX(-150px) rotate(10deg)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(100vw) rotate(10deg)',
            opacity: '1',
          },
        },
      },
      animation: {
        planeFly: 'planeFly 2.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
