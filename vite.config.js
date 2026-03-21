import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 3000,
    proxy: {
      '/api/dashboard': {
        target: 'http://localhost:8082',
        rewrite: p => p.replace(/^\/api\/dashboard/, '/api/v1'),
        changeOrigin: true,
      },
      '/api/plots': {
        target: 'http://localhost:8083',
        rewrite: p => p.replace(/^\/api\/plots/, '/api/v1/plots'),
        changeOrigin: true,
      },
      '/api/media': {
        target: 'http://localhost:8081',
        rewrite: p => p.replace(/^\/api\/media/, '/api/v1/media'),
        changeOrigin: true,
      },
    },
  },
})