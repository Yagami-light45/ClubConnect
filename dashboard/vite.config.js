import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make process available in development
    global: 'globalThis',
  },
  server: {
    port: 3000, // Default React port
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})