/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5700',
        secondary: '#1F2937',
        accentLight: '#FFEDD5',
      },
      borderRadius: {
        lg: '1rem',
      },
    },
  },
  plugins: [],
};