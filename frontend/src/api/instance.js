import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8088", // 게이트웨이 주소
  timeout: 5000, // 요청 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
