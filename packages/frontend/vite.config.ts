import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
<<<<<<< HEAD
  host: '0.0.0.0',
  port: 5173,
=======
  host: 0.0.0.0,
  port: process.env.PORT || 5173,
>>>>>>> 11f3292 (updated the ports for the packages)
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
