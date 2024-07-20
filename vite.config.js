import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/gemini":{
        target:"http://localhost:5173",
        changeOrigin:true,
      }
    }
  }
})
