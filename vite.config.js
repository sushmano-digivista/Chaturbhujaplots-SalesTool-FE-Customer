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
        target: 'https://chaturbhujaplots-salestool-be-dasboardservices-production.up.railway.app',
        rewrite: p => p.replace(/^\/api\/dashboard/, '/api/v1'),
        changeOrigin: true,
        secure: true,
      },
      '/api/plots': {
        target: 'https://chaturbhujaplots-salestool-be-plotuploadservices-production.up.railway.app',
        rewrite: p => p.replace(/^\/api\/plots/, '/api/v1/plots'),
        changeOrigin: true,
        secure: true,
      },
      '/api/media': {
        target: 'https://chaturbhujaplots-salestool-be-commonservices-production.up.railway.app',
        rewrite: p => p.replace(/^\/api\/media/, '/api/v1/media'),
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
