import React from "react";
import { Navigate } from "react-router-dom";


const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // 토큰 없으면 로그인 페이지로
    return <Navigate to="/login" replace />;
  }

  try {

    if (localStorage.getItem("role") != "ADMIN") {
    // 관리자 권한 없으면 처음 경로("/")로 리다이렉트
    return <Navigate to="/" replace />;
    }

    // 관리자면 정상 렌더링
    return children;
    } catch (err) {
    // 토큰 디코딩 실패 시에도 처음 경로("/")로 리다이렉트
    return <Navigate to="/" replace />;
}
};

export default AdminRoute;