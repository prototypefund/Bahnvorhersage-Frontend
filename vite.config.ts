import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': 'https://next.bahnvorhersage.de',
      // '/api': 'http://localhost:5000',
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:color';
          @import 'src/assets/scss/variables.scss';
          @import 'bootstrap/scss/_functions.scss'; @import 'bootstrap/scss/_variables.scss'; @import 'bootstrap/scss/_mixins.scss';
      `
      }
    }
  }
})
