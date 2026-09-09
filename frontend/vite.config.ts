/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 49432 },
  preview: { port: 49432 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/spec.config.ts'],
    env: { VITE_API_URL: 'http://api.test' },
  },
})
