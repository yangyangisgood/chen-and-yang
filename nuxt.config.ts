// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['/assets/css/style.css'],
  ssr: true,
  target: 'static', // 靜態網站
  app: {
    baseURL: '/chen-and-yang/' // GitHub repo 名稱
  },
  spaLoadingTemplate: 'app/loading-template.html',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
