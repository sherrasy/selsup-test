import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/selsup-test/',
  plugins: [react()],
  server: {
    open: true,
    port: 4001,
  },
})
