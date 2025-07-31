import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/members': {
        target: 'http://localhost:8082',//백엔드포트8088->8082로수정
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/members/, ''),
      },
    },
  },
})