export const logout = () => {
  // 1. 토큰 삭제
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  // 2. RefreshToken 쿠키 삭제 요청 (백엔드 API 호출)
  fetch("/users/logout", { method: "POST", credentials: "include" })
    .catch(() => console.log("로그아웃 API 호출 실패"));

  // 3. 로그인 페이지로 이동
  window.location.href = "login";
};
