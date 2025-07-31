import axios from 'axios'

const api = axios.create({
  baseURL: 'https://special-fishstick-v676qp7v9x962xrw9-8083.app.github.dev', // 백엔드 포트에 맞게 수정
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api