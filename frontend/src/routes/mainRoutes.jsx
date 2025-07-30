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
import Anomalyreport from "../component/Anomalyreport/anomalyreport";
import AnomalyReportEdit from "../component/anomalyreport/AnomalyreportEdit";
import Facility from "../component/facility/Facility";

const mainRoutes = (
  <Route path="/" element={<Layout />}>
    <Route path="/home" element={<Home />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/notifications/:id" element={<NotificationDetail />} />
    <Route path="notifications/new" element={<NotificationWrite />} />
    <Route path="/alert" element={<Alert />} />
    <Route path="/dash" element={<Dashboard />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/anomaly" element={<Anomaly />} />
    <Route path="/dashdetail" element={<DashDetail />} />
    <Route path="/anomalyreport" element={<Anomalyreport />} />
    <Route path="/anomalyreport/edit" element={<AnomalyReportEdit />} />
    <Route path="facility" element={<Facility />} />
  </Route>
);

export default mainRoutes;
