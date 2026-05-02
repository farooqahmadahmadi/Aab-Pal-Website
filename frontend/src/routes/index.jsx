import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Users/Login";
import ProtectedRoute from "../components/ProtectedRoute";

// Imported Layouts
import AdminLayout from "../layouts/AdminLayout";
import Public from "../layouts/PublicLayout";

// Imported Dashboards

// Imported Pages
import UsersList from "../pages/Users/UsersList";
import UserProfile from "../pages/Users/Profile";

import Notifications from "../pages/Notification/Notifications";
import SystemLogs from "../pages/SystemLogs/SystemLogs";

// Reports
// Attendance

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Company */}
        <Route
          path="/admin/company/company-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <CompanyInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
