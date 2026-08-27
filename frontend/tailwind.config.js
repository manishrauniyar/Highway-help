/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#14171C',
          50: '#F4F5F6',
          100: '#E3E5E8',
          200: '#C3C8D0',
          300: '#9AA2AE',
          400: '#6B7482',
          500: '#4A515C',
          600: '#343A43',
          700: '#23272E',
          800: '#1B1E24',
          900: '#14171C',
          950: '#0C0E11',
        },
        road: {
          DEFAULT: '#1B2430',
          light: '#26313F',
        },
        beacon: {
          DEFAULT: '#FFB020',
          light: '#FFC862',
          dark: '#D6900E',
        },
        signal: {
          DEFAULT: '#E5484D',
          light: '#FF6B6F',
          dark: '#B8383C',
        },
        mint: {
          DEFAULT: '#33C481',
        },
        lane: '#F5F6F7',
        slate: {
          muted: '#8A94A6',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.25)',
        pop: '0 8px 30px rgba(0,0,0,0.35)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.6)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        beaconSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s cubic-bezier(0.2,0.6,0.4,1) infinite',
        beaconSpin: 'beaconSpin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
