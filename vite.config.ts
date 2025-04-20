import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      '*'
    ],
    proxy: {
      '/api/upload': {
        target: 'http://47.112.100.83:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/upload/, '/upload')
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
