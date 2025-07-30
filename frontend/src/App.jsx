import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/mainRoutes";
import adminRoutes from "./routes/adminRoutes";
import Login from "./component/login/login";
import SignUp from "./component/Signup/singup";
import ProtectedRoute from "./component/login/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인, 회원가입은 보호하지 않음 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

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
    </Router>
  );
}

export default App;