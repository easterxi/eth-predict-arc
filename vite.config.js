import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path Aliases (Very Useful)
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@assets": "/src/assets",
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'https://lucid-cooperation-production-511a.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
  
  // Optional: Set base if deploying to subfolder later
  // base: '/',
})