// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/image'],
  css: [
    '@/assets/css/main.css'
  ],
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary'
      ]
    }
  }
})