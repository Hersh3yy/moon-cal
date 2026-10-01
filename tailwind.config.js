/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      // Design tokens. Dark-only site: ink is the page, moon-* is the text scale,
      // glow is the one accent, surface/line build the glass cards.
      colors: {
        ink: { DEFAULT: '#05060a', 2: '#0b0d14', 3: '#13151e' },
        moon: { 50: '#f8f8f6', 100: '#ecebe6', 300: '#cfcdc6', 500: '#a3a19a' },
        muted: '#b9b9c2',
        glow: { DEFAULT: '#dfe6ff', 300: '#9db4ff' },
        surface: 'rgba(255, 255, 255, 0.06)',
        line: 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        display: ['Audiowide', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        moon: '0 0 60px rgba(223, 230, 255, 0.25)',
      },
      borderRadius: { card: '1.25rem' },
      maxWidth: { page: '72rem', prose: '42rem' },
      transitionTimingFunction: { soft: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    },
  },
  plugins: [],
}
