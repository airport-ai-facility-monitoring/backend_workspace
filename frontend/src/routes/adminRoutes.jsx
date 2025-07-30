import { Route } from "react-router-dom";
import AdminLayout from "../component/admin/Layout/AdminLayout";
import AdminHome from "../component/admin/AdminHome";
import UsersList from "../component/admin/UsersList";
import UserDetail from "../component/admin/UserDetail";
import NotificationsPage from "../component/notifications/NotificationsPage";

const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="home" element={<AdminHome />} />
    <Route path="management" element={<UsersList />} />
    <Route path="users/:id" element={<UserDetail />} />
    <Route path="notifications" element={<NotificationsPage />} />
  </Route>
);

export default adminRoutes;
