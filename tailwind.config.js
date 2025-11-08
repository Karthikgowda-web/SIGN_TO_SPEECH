
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'cyan-400': '#22D3EE',
        'purple-400': '#C084FC',
        'red-400': '#F87171',
        'green-400': '#4ADE80',
        'yellow-400': '#FACC15',
        'gray-900': '#111827',
        'gray-800': '#1F2937',
        'gray-700': '#374151',
        'gray-600': '#4B5563',
        'gray-500': '#6B7280',
        'gray-400': '#9CA3AF',
        'white/5': 'rgba(255, 255, 255, 0.05)',
        'white/10': 'rgba(255, 255, 255, 0.1)',
        'black/30': 'rgba(0, 0, 0, 0.3)',
        'black/40': 'rgba(0, 0, 0, 0.4)',
        'cyan-500/80': 'rgba(6, 182, 212, 0.8)',
        'red-900/30': 'rgba(127, 29, 29, 0.3)',
        'green-900/30': 'rgba(20, 83, 45, 0.3)',
        'yellow-900/30': 'rgba(113, 63, 18, 0.3)',
      },
    },
  },
  plugins: [],
}
