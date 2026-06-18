/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: { 
    extend: {
      colors: {
        white: '#FFFFFF',
        'light-green': '#00DD00',
        'medium-green': '#00B200',
        'light-blue': '#818cf8',
        'medium-blue': '#4f46e5',
        'light-grey': '#F2F2F2',
        'medium-grey':'#cbd5e1',
        'light-black': '#1E1E1E',
        black: '#000000',
      },
      width: {
        small: '16.666667%',
        medium: '50%',
        large: '83.333333%',
        'x-large': '100%',
        page: '60%',
      },
    },
  },
  plugins: [
    require("daisyui"),
    function({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '6px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        },
        '.custom-select': {
          backgroundColor: '#F0F4F8',
          color: '#333',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          border: '1px solid #CBD5E1',
        },
        '.custom-select:focus': {
          outline: 'none',
          borderColor: '#4F46E5',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}