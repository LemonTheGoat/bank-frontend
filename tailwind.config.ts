import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
