import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "../pages/admin/Users/Login";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import AdminLayout from "../layouts/AdminLayout";

// Pages
import WebsiteLanguageList from "../pages/admin/websiteLanguage/WebsiteLanguageList";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />

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