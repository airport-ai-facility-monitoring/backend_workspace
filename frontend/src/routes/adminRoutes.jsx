import React from 'react';
import { Route } from "react-router-dom";
import AdminLayout from "../component/admin/Layout/AdminLayout";
import AdminHome from "../component/admin/AdminHome";
import UsersList from "../component/admin/UsersList";
import UserDetail from "../component/admin/UserDetail";
import NotificationsPage from "../component/notifications/NotificationsPage";

const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "home", element: <AdminHome /> },
      { path: "management", element: <UsersList /> },
      { path: "users/:id", element: <UserDetail /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
];
export default adminRoutes;
