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
import EquipmentsRegister from "../component/equipmentsregister/EquipmentsRegister";
import EquipmentsList from "../component/equipmentslist/EquipmentsList";
import Equipmentreport from "../component/equipmentreport/Equipmentreport";
import EquipmentreportDetail from "../component/equipmentreport/EquipmentreportDetail";
import RunwayCrack from '../component/crack/RunwayCrack';
import Crackreport from '../component/crack/report/CrackReport';
import EquipmentreportRegist from "../component/equipmentreport/EquipmentreportRegist";
import NotificationEdit from '../component/notifications/NotificationEdit'


const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "notifications/:id", element: <NotificationDetail /> },
      { path: "notifications/new", element: <NotificationWrite /> },
      { path: "crack", element: <RunwayCrack/>},
      { path: "alert", element: <Alert /> },
      { path: "dash", element: <Dashboard /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "dashdetail/:id", element: <DashDetail /> },
      { path: "equipmentsregister",element: <EquipmentsRegister />},
      { path: "equipment",element: <EquipmentsList />},
      { path: "/report/:rcId", element: <Crackreport /> },
      { path: "equipment/report", element: <Equipmentreport /> },
      { path: "equipment/report/:id", element: <EquipmentreportDetail /> },
      { path: "equipment/report/regist", element: <EquipmentreportRegist /> },
      { path: "equipmentreport", element: <Equipmentreport /> },
      { path: "equipmentreport/:id", element: <EquipmentreportDetail /> },
      { path: "equipmentreport/regist", element: <EquipmentreportRegist /> },
      { path: "notifications/edit/:id", element: <NotificationEdit />},
    ],
  },
];

export default mainRoutes;