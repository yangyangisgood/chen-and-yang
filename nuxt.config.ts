/// <reference types="nuxt" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['/assets/css/style.css'],
  ssr: false,
  app: {
    baseURL: '/chen-and-yang/', // GitHub repo 名稱
    buildAssetsDir: 'assets/'
  },
  nitro: {
    preset: 'static',
  },
  spaLoadingTemplate: 'app/loading-template.html',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
