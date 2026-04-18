/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a151a',
          dim: '#0a151a',
          bright: '#303b41',
          container: {
            lowest: '#051015',
            low: '#121d23',
            DEFAULT: '#162127',
            high: '#202b32',
            highest: '#2b363d',
          },
          variant: '#2b363d',
          tint: '#00daf3',
        },
        primary: {
          DEFAULT: '#00daf3',
          container: '#001e22',
          fixed: '#9cf0ff',
          'fixed-dim': '#00daf3',
          on: '#00363d',
          'on-container': '#0090a1',
        },
        secondary: {
          DEFAULT: '#cdbdff',
          container: '#5203d5',
          fixed: '#e8deff',
          'fixed-dim': '#cdbdff',
          on: '#370096',
          'on-container': '#c0acff',
        },
        tertiary: {
          DEFAULT: '#00e1ae',
          container: '#001f16',
          fixed: '#45fec9',
          'fixed-dim': '#00e1ae',
          on: '#003829',
          'on-container': '#009472',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
          on: '#690005',
          'on-container': '#ffdad6',
        },
        'on-surface': {
          DEFAULT: '#d8e4ec',
          variant: '#c4c6cc',
        },
        outline: {
          DEFAULT: '#8e9196',
          variant: '#44474c',
        },
        inverse: {
          surface: '#d8e4ec',
          'on-surface': '#273238',
          primary: '#006875',
        },
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-md': ['2.75rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-md': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'title-lg': ['1.125rem', { lineHeight: '1.45', fontWeight: '600' }],
        'title-md': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.55', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'ambient': '0 8px 40px rgba(5, 16, 21, 0.04)',
        'glow-primary': '0 0 20px rgba(0, 218, 243, 0.15)',
        'glow-secondary': '0 0 20px rgba(205, 189, 255, 0.15)',
        'glow-tertiary': '0 0 20px rgba(0, 225, 174, 0.15)',
        'card': '0 4px 24px rgba(5, 16, 21, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00daf3, #0090a1)',
        'gradient-secondary': 'linear-gradient(135deg, #cdbdff, #5203d5)',
        'gradient-surface': 'linear-gradient(180deg, #121d23, #0a151a)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 218, 243, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 218, 243, 0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
