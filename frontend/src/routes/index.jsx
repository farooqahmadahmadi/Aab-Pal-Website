import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Users/Login";
import ProtectedRoute from "../components/ProtectedRoute"

// Imported Layouts
import AdminLayout from "../layouts/AdminLayout";
import HRLayout from "../layouts/HRLayout";
import FinancialLayout from "../layouts/FinancialLayout";
import PMLayout from "../layouts/PMLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import ClientLayout from "../layouts/ClientLayout";

// Imported Dashboards
import AdminDashboard from "../pages/Dashboards/AdminDashboard";
import HRDashboard from "../pages/Dashboards/HRDashboard";
import FinancialDashboard from "../pages/Dashboards/FinancialDashboard";
import PMDashboard from "../pages/Dashboards/PMDashboard";
import EmployeeDashboard from "../pages/Dashboards/EmployeeDashboard";
import ClientDashboard from "../pages/Dashboards/ClientDashboard";

// Imported Pages
import UsersList from "../pages/Users/UsersList";
import CompanyInfo from "../pages/Company/CompanyInfo";
import CompanyDocuments from "../pages/Company/CompanyDocuments";
import Departments from "../pages/Departments/Departments";
import EmployeeInfo from "../pages/Employees/Employees";
import EmployeeEdcational from "../pages/Employees/EmployeeEducation";

export default function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Login />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/company/company-info" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <CompanyInfo />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/company/company-documents" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <CompanyDocuments />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/departments/departments-info" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <Departments />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/employees/employee-info" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <EmployeeInfo />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/employees/employee-education-info" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <EmployeeEdcational />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                <Route path="/admin/users/user-list" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout>
                            <UsersList />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                {/* HR */}
                <Route path="/hr/dashboard" element={
                    <ProtectedRoute allowedRoles={["HR"]}>
                        <HRLayout>
                            <HRDashboard />
                        </HRLayout>
                    </ProtectedRoute>
                } />

                <Route path="/hr/employees/employee-info" element={
                    <ProtectedRoute allowedRoles={["HR"]}>
                        <AdminLayout>
                            <EmployeeInfo />
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                {/* Financial */}
                <Route path="/financial/dashboard" element={
                    <ProtectedRoute allowedRoles={["Financial"]}>
                        <FinancialLayout>
                            <FinancialDashboard />
                        </FinancialLayout>
                    </ProtectedRoute>
                } />

                {/* PM */}
                <Route path="/pm/dashboard" element={
                    <ProtectedRoute allowedRoles={["PM"]}>
                        <PMLayout>
                            <PMDashboard />
                        </PMLayout>
                    </ProtectedRoute>
                } />

                {/* Employee */}
                <Route path="/employee/dashboard" element={
                    <ProtectedRoute allowedRoles={["Employee"]}>
                        <EmployeeLayout>
                            <EmployeeDashboard />
                        </EmployeeLayout>
                    </ProtectedRoute>
                } />

                {/* Client */}
                <Route path="/client/dashboard" element={
                    <ProtectedRoute allowedRoles={["Client"]}>
                        <ClientLayout>
                            <ClientDashboard />
                        </ClientLayout>
                    </ProtectedRoute>
                } />

            </Routes>
        </BrowserRouter>
    );
}