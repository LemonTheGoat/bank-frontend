export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['~/assets/index.css'],
  app: {
    pageTransition: { name: 'page' }
  }
})