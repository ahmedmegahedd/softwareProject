/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E90FF',
        background: '#000000',
        text: '#FFFFFF',
        secondary: '#1F2937',
        accentLight: '#FFEDD5',
      },
      borderRadius: {
        lg: '1rem',
      },
      spacing: {
        'section': '2rem',
      },
    },
  },
  plugins: [],
} 