/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* ============================================
         UDYANSAATHI GLOBAL DESIGN SYSTEM
         "Soft UI" Aesthetic - Light Mode Focus
         ============================================ */
      
      colors: {
        // Canvas - Main page background
        canvas: '#F1F5F9',
        // Surface - Card backgrounds  
        surface: '#FFFFFF',
        
        // Primary Accent - Sky Blue to Ocean Blue gradient range
        primary: {
          DEFAULT: '#4A90E2',
          50: '#EBF4FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#4A90E2',
          600: '#2563EB',
          700: '#0052CC',
          800: '#1E40AF',
          900: '#1E3A8A',
          light: '#4A90E2',  // Sky Blue
          dark: '#0052CC',   // Ocean Blue
        },
        
        // Text Colors
        ink: '#1A202C',      // Dark Slate - Headings
        metal: '#718096',    // Cool Grey - Body text
        muted: '#A0AEC0',    // Light grey - Placeholders
        
        // Border color - Soft mist
        mist: '#E2E8F0',
        
        // Status Colors - Vibrant Pastels for data indicators
        status: {
          good: '#48BB78',      // Emerald Green - Good
          moderate: '#ED8936',  // Amber/Orange - Moderate
          critical: '#F56565',  // Rose Red - Critical
          info: '#4299E1',      // Info Blue
        },
        
        // AQI specific colors (Pastel shades)
        aqi: {
          good: '#48BB78',
          satisfactory: '#68D391',
          moderate: '#ECC94B',
          poor: '#ED8936',
          'very-poor': '#FC8181',
          severe: '#C53030',
        },
        
        // Water Quality specific colors
        water: {
          excellent: '#38B2AC',
          good: '#4FD1C5',
          moderate: '#F6E05E',
          poor: '#F6AD55',
          critical: '#FC8181',
        },
      },
      
      // Heavy Rounding - Soft UI Signature
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'card': '24px',      // Main cards - rounded-3xl
        'inner': '16px',     // Inner elements - rounded-xl
        'button': '12px',
        'input': '12px',
        'badge': '9999px',
      },
      
      // Soft, Diffuse Shadows - No harsh outlines
      boxShadow: {
        'soft-xs': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-sm': '0 2px 12px rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-md': '0 6px 24px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 12px 40px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 8px rgba(74, 144, 226, 0.25)',
        'button-hover': '0 4px 16px rgba(74, 144, 226, 0.35)',
        'inner': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'glow-primary': '0 0 20px rgba(74, 144, 226, 0.3)',
        'glow-success': '0 0 20px rgba(72, 187, 120, 0.3)',
        'glow-warning': '0 0 20px rgba(237, 137, 54, 0.3)',
        'glow-danger': '0 0 20px rgba(245, 101, 101, 0.3)',
      },
      
      // Typography - Plus Jakarta Sans / Inter
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        // Data display - Large, tight tracking
        'data-xs': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'data-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'data': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'data-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'data-xl': ['4rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '800' }],
      },
      
      // Spacing - Bento Box Grid Methodology
      spacing: {
        'card': '24px',      // Min 24px padding inside cards
        'card-sm': '16px',
        'card-lg': '32px',
        'section': '32px',
        'bento-gap': '20px', // Gap between bento cards
      },
      
      // Grid for Bento Layout
      gridTemplateColumns: {
        'bento': 'repeat(12, minmax(0, 1fr))',
        'bento-sm': 'repeat(6, minmax(0, 1fr))',
      },
      
      // Transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
