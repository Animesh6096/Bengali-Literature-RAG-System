/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F3EC',
        ink: {
          DEFAULT: '#1F2933',
          soft: '#52606D',
          faint: '#9AA5B1',
        },
        navy: {
          50: '#EEF2F7',
          100: '#D9E2EC',
          600: '#2A4A73',
          700: '#1F3A5F',
          800: '#172C48',
        },
        clay: '#B5532E',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'Inter', 'sans-serif'],
        serif: ['Noto Serif Bengali', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
