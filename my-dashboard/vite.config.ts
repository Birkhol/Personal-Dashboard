import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api/vg-rss": {
        target: "https://www.vg.no",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/vg-rss/, "/rss/feed")
      }
    }
  }
})
