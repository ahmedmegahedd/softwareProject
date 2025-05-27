/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: '#111827',
        textSecondary: '#6B7280',
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        border: '#F2F2F2',
        white: '#FFFFFF',
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