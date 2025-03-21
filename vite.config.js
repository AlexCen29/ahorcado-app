import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    fs: {
      // Permite acceder a todos los archivos del proyecto y node_modules
      allow: ['..', 'node_modules']
    }
  },
  define: {
    API_URL: JSON.stringify('https://ahorcado-api-production.up.railway.app/api/auth/'),
  }
})