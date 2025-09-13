import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/providers/**/*.{ts,tsx}',
    './src/contexts/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sky-based palette tuned for travel vibes
        skybase: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      backgroundImage: {
        'sky-gradient': 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 60%, #FFFFFF 100%)',
      },
      boxShadow: {
        fluffy: '0 10px 30px rgba(14,165,233,0.25)',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-kr)', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        drift: 'drift 60s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
