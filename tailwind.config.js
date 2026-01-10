/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Smart City Glass & Grid Design System Colors
      colors: {
        // Canvas - Main page background
        canvas: '#F1F5F9',
        // Surface - Card backgrounds  
        surface: '#FFFFFF',
        // Primary - Brand color (Udyan Teal)
        primary: {
          DEFAULT: '#0D9488',
          50: '#E6FAF8',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Text colors
        ink: '#0F172A',      // Main headings & primary values
        metal: '#64748B',    // Labels, subtitles
        // Border color
        mist: '#E2E8F0',
        // Status colors - Only for data points
        status: {
          danger: '#EF4444',
          warning: '#F97316', 
          safe: '#10B981',
        },
        // AQI specific colors
        aqi: {
          good: '#10B981',
          satisfactory: '#84CC16',
          moderate: '#EAB308',
          poor: '#F97316',
          'very-poor': '#EF4444',
          severe: '#7C2D12',
        }
      },
      // Uniform border radius (16px = 1rem)
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
        'input': '0.75rem',
      },
      // Soft shadows for cards
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevation-2': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevation-3': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      // Font family
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Spacing for consistent padding
      spacing: {
        'card': '1.5rem',
        'section': '2rem',
      },
    },
  },
  plugins: [],
};
