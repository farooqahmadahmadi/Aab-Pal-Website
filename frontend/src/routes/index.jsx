import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "../pages/admin/Users/Login";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";

// Pages
import WebsiteLanguageList from "../pages/admin/websiteLanguage/WebsiteLanguageList";
import HomePage from "../pages/public/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}
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

      </Routes>
    </BrowserRouter>
  );
}