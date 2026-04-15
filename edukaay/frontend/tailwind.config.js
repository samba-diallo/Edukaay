/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Palette de couleurs raffinée
      colors: {
        primary: {
          50: '#F0F7F5',
          100: '#D9EAE6',
          200: '#B3D4CE',
          300: '#7DB8AF',
          400: '#4A9B89',
          500: '#0F7B6C',
          DEFAULT: '#0F7B6C',
          600: '#0D6B5D',
          700: '#0A5848',
          800: '#084639',
          900: '#063835',
        },
        accent: {
          50: '#FFFBF0',
          100: '#FEF3D9',
          200: '#FDE7B3',
          300: '#FCD870',
          400: '#F5C84D',
          500: '#D4AF37',
          600: '#C9A02E',
          700: '#A88225',
          800: '#8B681B',
          900: '#705612',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#121212',
        },
      },
      
      // Typographie améliorée
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        base: ['16px', { lineHeight: '24px', letterSpacing: '0.15px' }],
        lg: ['18px', { lineHeight: '28px', letterSpacing: '0.1px' }],
        xl: ['20px', { lineHeight: '28px', letterSpacing: '0px' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '0px' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
        '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.5px' }],
      },
      
      // Ombres raffinées contrastées et subtiles
      boxShadow: {
        none: '0 0 #0000',
        xs: '0 1px 2px 0 rgba(15, 123, 108, 0.05)',
        sm: '0 1px 3px 0 rgba(15, 123, 108, 0.08), 0 1px 2px -1px rgba(15, 123, 108, 0.08)',
        base: '0 4px 6px -1px rgba(15, 123, 108, 0.1), 0 2px 4px -2px rgba(15, 123, 108, 0.1)',
        md: '0 10px 15px -3px rgba(15, 123, 108, 0.12), 0 4px 6px -4px rgba(15, 123, 108, 0.1)',
        lg: '0 20px 25px -5px rgba(15, 123, 108, 0.15), 0 8px 10px -6px rgba(15, 123, 108, 0.1)',
        xl: '0 25px 50px -12px rgba(15, 123, 108, 0.18)',
        '2xl': '0 25px 50px -12px rgba(15, 123, 108, 0.2)',
        inner: 'inset 0 2px 4px 0 rgba(15, 123, 108, 0.05)',
        
        // Ombres avec couleur d'accent
        'accent-xs': '0 1px 2px 0 rgba(212, 175, 55, 0.06)',
        'accent-sm': '0 2px 4px 0 rgba(212, 175, 55, 0.08)',
        'accent-md': '0 10px 15px -3px rgba(212, 175, 55, 0.12)',
      },
      
      // Animations fluides
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.4s ease-out',
        slideDown: 'slideDown 0.4s ease-out',
        slideLeft: 'slideLeft 0.4s ease-out',
        slideRight: 'slideRight 0.4s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        shimmer: 'shimmer 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      
      // Espacement affiné
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      
      // Transitions fluides
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
      },
      
      // Dégradés personnalisés
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0F7B6C 0%, #12A08D 100%)',
        'gradient-accent': 'linear-gradient(135deg, #D4AF37 0%, #E0C45C 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FEF3D9 0%, #FCD870 100%)',
      },
      
      // Rayon de bordure affiné
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
