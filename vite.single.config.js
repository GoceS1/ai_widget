import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-content',
    rollupOptions: {
      input: resolve(__dirname, 'src/content.jsx'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
        inlineDynamicImports: true
      }
    }
  }
})
