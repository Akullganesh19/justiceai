/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#020617',
        gold: {
          DEFAULT: '#d4af37',
          light: '#f3e8ff',
          dark: '#c5a059',
        },
        'navy-slate': '#111827',
        silver: '#e2e8f0',
        void: '#020617', // Mantaining backward compatibility for bg-void
        raised: '#111827',
        text: {
          primary: '#e2e8f0',
          secondary: '#d4af37',
          tertiary: '#94a3b8',
        },
        red: {
          DEFAULT: '#ef4444', // Restoring red to functional error color
          light: '#fee2e2',
          dark: '#991b1b',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(8, 112, 184, 0.1)',
        'luxe': '0 10px 30px rgba(212, 175, 55, 0.05)',
        'hard': '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // Softening the fallback
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'analyze': 'analyze 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        analyze: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
