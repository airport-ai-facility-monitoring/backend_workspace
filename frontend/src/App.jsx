import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/mainRoutes";
import adminRoutes from "./routes/adminRoutes";
import Login from "./component/login/login";
import SignUp from "./component/Signup/index";
import ProtectedRoute from "./component/login/ProtectedRoute";
import RedirectIfAuth from "./component/login/RedirectIfAuth";
import PrivacyConsent from './component/Signup/TermsAgreementPage';
import { useEffect } from 'react';

function App() {

  // useEffect(() => {
  //   localStorage.setItem("accessToken", "123213");
  // }, []);

  return (
      <Routes>
        {/* 로그인, 회원가입은 RedirectIfAuth로 감싸기 */}
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <SignUp />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/signup/privacy-consent"
          element={
              <PrivacyConsent />
          }
        />


        {/* mainRoutes */}
        {mainRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}

          >
            {route.children &&
              route.children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={<ProtectedRoute>{child.element}</ProtectedRoute>}
                />
              ))}
          </Route>
        ))}

        {/* adminRoutes */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          >
            {route.children &&
              route.children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={<ProtectedRoute>{child.element}</ProtectedRoute>}
                />
              ))}
          </Route>
        ))}
      </Routes>
  );
}

export default App;