import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 포트에 맞게 수정
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api