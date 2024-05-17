import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  server: {
    // Load proxy configuration from .env
    proxy: {
      '/r/': {
        target: 'http://localhost:9800',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/graphql': {
        target: 'http://localhost:9800',
        changeOrigin: true,
       // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
})
