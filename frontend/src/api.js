import axios from "axios";

const api = axios.create({
  baseURL: "https://scaling-space-meme-jpvvjq4rvprh5pxp-8088.app.github.dev",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ 쿠키 자동 전송 옵션
});

export default api;