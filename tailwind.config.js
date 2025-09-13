/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Calisto MT', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
         sparkle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
         'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'flip': {
          'from': { transform: 'rotateY(0deg)' },
          'to': { transform: 'rotateY(180deg)' },
        },
        'rotate-brain': {
          '0%': { transform: 'rotateY(0deg) rotateX(10deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(10deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'fade-in-slow': 'fade-in 1.2s ease-out forwards',
        'slide-down': 'slide-down 0.8s ease-out forwards',
        'slide-down-delay-1': 'slide-down 0.8s ease-out 0.2s forwards',
        'slide-down-delay-2': 'slide-down 0.8s ease-out 0.4s forwards',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'flip': 'flip 0.6s ease-in-out forwards',
        'rotate-brain': 'rotate-brain 20s linear infinite',
      },
    },
  },
  plugins: [],
}
