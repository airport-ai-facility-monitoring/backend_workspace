import React from 'react';
import { Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../component/Home/Home";
import NotificationsPage from "../component/notifications/NotificationsPage";
import NotificationDetail from "../component/notifications/NotificationDetail";
import NotificationWrite from "../component/notifications/NotificationWrite";
import Alert from "../component/alert/Alert";
import Dashboard from "../component/Dashboard/Dashboard";
import DashDetail from "../component/Dashboard/DashDetail";
import SettingsPage from "../component/settings/SettingsPage";
import Anomaly from "../component/anomaly/Anomaly";
import Anomalyreport from "../component/anomalyreport/Anomalyreport";
import AnomalyReportEdit from "../component/anomalyreport/AnomalyreportEdit";
import Facility from "../component/facility/Facility";
import Equipmentreport from "../component/equipmentreport/Equipmentreport";
import EquipmentreportDetail from "../component/equipmentreport/EquipmentreportDetail";


const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "notifications/:id", element: <NotificationDetail /> },
      { path: "notifications/new", element: <NotificationWrite /> },
      { path: "alert", element: <Alert /> },
      { path: "dash", element: <Dashboard /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "anomaly", element: <Anomaly /> },
      { path: "dashdetail/:id", element: <DashDetail /> },
      { path: "anomalyreport", element: <Anomalyreport /> },
      { path: "anomalyreport/edit", element: <AnomalyReportEdit /> },
      { path: "facility", element: <Facility /> },
      { path: "equipmentreport", element: <Equipmentreport /> },
      { path: "equipmentreport/:id", element: <EquipmentreportDetail /> },
    ],
  },
];

export default mainRoutes;