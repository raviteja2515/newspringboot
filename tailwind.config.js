/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ring: 'hsl(var(--primary))',
        background: 'hsl(var(--background))',
        input: 'hsl(var(--primary) / 0.2)',
        'accent-foreground': 'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--foreground) / 0.6)',
      },
      ringOffsetColor: {
        DEFAULT: 'hsl(var(--background))',
      },
    },
  },
  plugins: [],
};