import { defineConfig } from 'vite'

export default defineConfig({
  // Configure for component testing
  esbuild: {
    target: 'es2020'
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: []
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})