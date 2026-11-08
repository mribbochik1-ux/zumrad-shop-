/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF8A00',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF8A00',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          hover: '#E57C00',
          light: '#FFF4E8',
          dark: '#CC6E00',
        },
      },
      fontFamily: {
        heading: ['Archivo', 'Oswald', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
