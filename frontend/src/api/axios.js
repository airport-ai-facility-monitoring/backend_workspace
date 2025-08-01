import axios from 'axios'

const api = axios.create({
  baseURL: 'https://glowing-space-fiesta-g4w47xwqjgj525qp-8083.app.github.dev', // 백엔드 포트에 맞게 수정
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api