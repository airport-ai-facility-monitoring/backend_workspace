import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/mainRoutes";
import Login from "./component/login/login";
import SignUp from "./component/Signup/index";
import ProtectedRoute from "./component/login/ProtectedRoute";
import RedirectIfAuth from "./component/login/RedirectIfAuth";
import PrivacyConsent from "./component/Signup/TermsAgreementPage";
import { ToastProvider } from "./component/Signup/ToastContainer"; 
import ResetPassword from "./component/login/ResetPassword";
import adminRoutes from "./routes/adminRoutes";


function App() {

  return (
      <ToastProvider>
        <Routes>
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
          <Route path="/signup/privacy-consent" element={<PrivacyConsent />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              //element={route.element}
            >
              {route.children &&
                route.children.map((child) => (
                  <Route
                    key={child.path}
                    path={child.path}
                    element={<ProtectedRoute>{child.element}</ProtectedRoute>}
                    //element={child.element}
                  />
                ))}
            </Route>
          ))}
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
        
      </ToastProvider>
  );
}

export default App;