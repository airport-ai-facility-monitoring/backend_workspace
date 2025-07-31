import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "./logout";

const RedirectIfAuth = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now - 60;
    } catch {
      return false;
    }
  };

  if (token) {
    if (isTokenValid(token)) {
      return <Navigate to="/home" replace />;
    } else {
      // 만료된 토큰 있으면 정리하고 로그인으로
      logout();
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default RedirectIfAuth;