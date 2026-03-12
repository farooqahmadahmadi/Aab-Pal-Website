import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import HRLayout from "./layouts/HRLayout";
import FinanceLayout from "./layouts/FinanceLayout";
import ClientLayout from "./layouts/ClientLayout";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import CompanyInfoForm from "./pages/admin/CompanyInfoForm";
import Departments from "./pages/admin/DepartmentInfoForm";

// HR Pages
import HRDashboard from "./pages/hr/Dashboard";

// Finance Pages
import FinanceDashboard from "./pages/finance/Dashboard";

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";

// Simulated Role (from auth, token, or state)
const currentRole = "admin"; // admin | manager | user

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------- Admin Routes ---------------- */}
        {currentRole === "admin" && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="company-info" element={<CompanyInfoForm />} />
            <Route path="departments" element={<Departments role="admin" />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        )}

        {/* ---------------- Manager / HR Routes ---------------- */}
        {currentRole === "manager" && (
          <Route path="/hr" element={<HRLayout />}>
            <Route index element={<HRDashboard />} />
            <Route path="dashboard" element={<HRDashboard />} />
            <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
          </Route>
        )}

        {/* ---------------- Finance Routes ---------------- */}
        {currentRole === "finance" && (
          <Route path="/finance" element={<FinanceLayout />}>
            <Route index element={<FinanceDashboard />} />
            <Route path="dashboard" element={<FinanceDashboard />} />
            <Route path="*" element={<Navigate to="/finance/dashboard" replace />} />
          </Route>
        )}

        {/* ---------------- User / Client Routes ---------------- */}
        {currentRole === "user" && (
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="client" element={<ClientDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {/* ---------------- Global Fallback ---------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;