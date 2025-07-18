import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineNuxtConfig({
  vite: {
    plugins: [vue()],
    define: {
      __VUE_OPTIONS_API__: true
    }
  }
})