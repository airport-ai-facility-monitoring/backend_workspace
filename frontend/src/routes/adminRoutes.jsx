import React from "react";
import AdminRoute from "../component/admin/AdminRoute";
import EmployeeRegister from "../component/admin/EmployeeRegister";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminRoute>
        {/* AdminLayout 없이 바로 EmployeeRegister */}
        <EmployeeRegister />
      </AdminRoute>
    ),
    children: [], // 자식 경로 없음
  },
];

export default adminRoutes;