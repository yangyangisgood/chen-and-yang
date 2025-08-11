/// <reference types="nuxt" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'element-plus/dist/index.css',
    '/assets/css/style.css'],
  ssr: false,
  app: {
    baseURL: '/chen-and-yang/', // GitHub repo 名稱
    buildAssetsDir: 'assets/',
    head: {
      title: "快樂霜淇淋",
      // 設置分頁icon
      link: [{ rel: "icon", type: "image/x-icon", href: "ice-cream.png" }],
    }
  },
  nitro: {
    preset: 'static',
  },
  spaLoadingTemplate: 'app/loading-template.html',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
