import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import mainRoutes from "./routes/mainRoutes";
import adminRoutes from "./routes/adminRoutes";
import Login from "./component/login/login";
import SignUp from "./component/Signup/singup";
import ProtectedRoute from "./component/login/ProtectedRoute";
import RedirectIfAuth from "./component/login/RedirectIfAuth";

function App() {


  return (
    <Router>
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
            <ProtectedRoute>
              {adminRoutes}
            </ProtectedRoute>
          }
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;