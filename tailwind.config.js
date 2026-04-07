/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#0e72a8', // Cerulean
          light: '#9abfd4', // Ice Blue
          dark: '#103b5a', // Rich Ocean
          glow: '#0e72a8', 
        },
        blue: {
          DEFAULT: '#0e72a8', // Cerulean
          light: '#9abfd4', // Ice Blue
          dark: '#103b5a', // Rich Ocean
          indigo: '#1b2936', 
        },
        ink: '#111a22', // Slightly lighter than void
        void: '#0a0b0d', // Abyss Black
        raised: '#1b2936', // Deep Slate Blue
        float: '#17222d', 
        surface: '#121f29', 
        platinum: '#9abfd4', // Ice Blue
        text: {
          primary: '#9abfd4', // Ice Blue
          secondary: '#0e72a8', // Cerulean
          tertiary: '#103b5a', // Rich Ocean
        },
        accent: {
          success: '#0e72a8', 
          error: '#ef4444', 
          warning: '#103b5a', 
          info: '#0e72a8', 
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'hard': '8px 8px 0px 0px rgba(0,0,0,0.5)',
        'hard-lg': '12px 12px 0px 0px rgba(0,0,0,0.5)',
        'hard-red': '8px 8px 0px 0px rgba(225, 29, 72, 0.4)',
        'hard-blue': '8px 8px 0px 0px rgba(37, 99, 235, 0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}
