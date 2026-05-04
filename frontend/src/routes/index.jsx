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
import HomePageList from "./../pages/admin/home/HomePageList";
import BlogsPageList from "./../pages/admin/blogs/BlogsPageList";
import BlogCommentsList from "./../pages/admin/blogs/BlogCommentsList";
import AboutPageList from "./../pages/admin/about/AboutPageList";
import UsersList from "./../pages/admin/users/UsersList";
import FaqsPageList from "./../pages/admin/faqs/FaqsPageList";

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
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <HomePageList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <BlogsPageList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/blog-comments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <BlogCommentsList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/about"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AboutPageList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faqs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <FaqsPageList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <UsersList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
