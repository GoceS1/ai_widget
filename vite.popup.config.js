import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-popup',
    rollupOptions: {
      input: resolve(__dirname, 'src/popup.jsx'),
      output: {
        entryFileNames: 'popup.js',
        format: 'iife',
        inlineDynamicImports: true
      }
    }
  }
})
