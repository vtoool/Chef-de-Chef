import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#FFF7E5',
        'brand-brown-dark': '#3B2414',
        'brand-brown-light': '#5A3A26',
        'brand-gold': '#FFC857',
        'brand-orange': '#F7931E',
      },
      fontFamily: {
        'serif': ['var(--font-playfair-display)', 'serif'],
        'sans': ['var(--font-inter)', 'sans-serif'],
        'serif-alt': ['var(--font-cormorant)', 'serif'],
        'cursive': ['var(--font-yesteryear)', 'cursive'],
      },
      backgroundImage: {
        'chef-gradient': 'linear-gradient(to right, #F7931E, #FFC857)',
      }
    },
  },
  plugins: [],
}
export default config