import { Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "../pages/admin/Users/Login";
import ProtectedRoute from "../components/ProtectedRoute";

// LAYOUTS
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";

// PUBLIC
import HomePage from "../pages/public/HomePage";

// ADMIN
import AdminDashboard from "../pages/admin/dashboards/AdminDashboard";
import WebsiteLanguageList from "../pages/admin/websiteLanguage/WebsiteLanguageList";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ROOT → PUBLIC HOME */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* PUBLIC */}
      <Route
        path="/home"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin/dashboard"
        element={
     <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN OTHER */}
      <Route
        path="/admin/languages"
        element={
     <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <WebsiteLanguageList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>
  );
}