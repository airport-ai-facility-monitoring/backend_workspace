import axios from "axios";

const api = axios.create({
  baseURL: "http://20.249.106.86:8080/", // 기존 GitHub Codespaces URL → 외부 IP
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 자동 전송 옵션
});

// Access Token 저장/조회 함수 (localStorage 사용)
function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function setAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

// 요청 인터셉터: 매 요청마다 Authorization 헤더에 access token 추가
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 Unauthorized 받으면 refresh token으로 access token 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry // 무한 재요청 방지용 플래그
    ) {
      originalRequest._retry = true;

      try {
        // refresh token으로 access token 재발급 요청
        
        const refreshResponse = await axios.post(
          "https://special-fishstick-v676qp7v9x962xrw9-8088.app.github.dev/users/refresh-token",
          {}, // 보통 본문이 비어있거나 refresh token 쿠키만으로 처리함
          { withCredentials: true } // 쿠키 전송 필수
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);
        console.log("재발급")
        // 새 토큰으로 원래 요청 헤더 변경 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 실패하면 로그인 페이지 등으로 리다이렉트
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;