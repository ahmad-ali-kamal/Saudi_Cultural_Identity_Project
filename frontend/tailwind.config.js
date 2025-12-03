/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Heritage Palette
        cream: '#F9F5F0',      // Main Background
        sand: '#EFE5D5',       // Secondary Background / Cards
        clay: '#855D38',       // Primary Brand Color / Buttons
        coffee: '#3E2B1D',     // Primary Text
        olive: '#5A614E',      // Muted Text / Secondary Text
        gold: '#D4AF37',       // Premium Accents
        'saudi-green': '#1D2F1F', // Deep Accents
        
        // Dark Mode Heritage Palette
        'coffee-dark': '#231B15',    // Main Background (Dark Mode)
        'coffee-light': '#2C241E',   // Cards/Surfaces (Dark Mode)

        // Retaining legacy names but mapping them to new palette where appropriate to prevent immediate breakage
        // Ideally these should be replaced in the code
        'primary': '#F9F5F0',    // Mapped to Cream (Backgrounds)
        'secondary': '#855D38',  // Mapped to Clay (Buttons/Highlights)
        'accent': '#1D2F1F',     // Mapped to Saudi Green
      },
      fontFamily: {
        'arabic': ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}