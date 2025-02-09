/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#3B82F6',
        accent: '#22C55E',
        dark: '#000000',
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFF0B3',
        },
        teal: {
          400: '#2DD4BF', // Adjust this to match your exact teal color
        },
        gray: {
          900: '#111827', // Adjust if needed to match your dark background
        },
      },
      fontSize: {
        '7xl': '74px',
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
    },
  },
  plugins: [],
}
