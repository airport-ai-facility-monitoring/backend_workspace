import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { logout } from "./logout";

const ProtectedRoute = ({ children }) => {
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

  if (!token || !isTokenValid(token)) {
    logout();
    return null; // <Navigate> 안 씀
  }

  return children;
};

export default ProtectedRoute;