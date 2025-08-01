// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/app/', // 기본값: 루트 경로
  // base: '/app', // 예: /app 아래에서 제공하려면 이렇게 설정
  server: {
    port: 5173,
  },
});