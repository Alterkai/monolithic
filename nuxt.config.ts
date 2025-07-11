// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/image', 'pinia-plugin-persistedstate'],
  css: [
    '@/public/assets/css/main.css'
  ],
  runtimeConfig: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10)
    }
  },
  image: {
    domains: [
      'cdn2.alterkaiscans.my.id'
    ],
    alias: {
      cdn2: 'https://cdn2.alterkaiscans.my.id',
    },
    quality: 75,
    format: ['webp']
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'error',
        'neutral'
      ]
    }
  }
})