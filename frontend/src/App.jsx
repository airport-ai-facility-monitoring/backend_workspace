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
        {/* mainRoutes 보호 */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              {/*mainRoutes*/}
            </ProtectedRoute>
          }
        />

        {/* adminRoutes 보호 */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              {/*adminRoutes*/}
            </ProtectedRoute>
          }
        />
        {mainRoutes}
        {adminRoutes}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
