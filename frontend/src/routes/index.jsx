import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Users/Login";
import ProtectedRoute from "../components/ProtectedRoute";

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
import EmployeeEducation from "../pages/Employees/EmployeeEducation";
import EmployeeDocuments from "../pages/Employees/EmployeeDocuments";
import EmployeeSalaryInfo from "../pages/Employees/EmployeeSalary";
import AttendanceShifts from "../pages/Employees/AttendanceShifts";
import EmployeeHiringInfo from "../pages/Employees/EmpHiringInfo";
import EmployeeAttendanceList from "../pages/Employees/EmployeeAttendanceList";
import EmployeeAttendance from "../pages/Employees/EmployeeAttendance";
import EmpSalaryPayment from "../pages/Employees/EmpSalaryPayment";

import ClientInfo from "../pages/Client/ClientInfo";
import ProjectInfo from "../pages/Project/ProjectInfo";
import BoqItems from "../pages/Project/BoqItems";
import ProjectPhasesInfo from "../pages/Project/ProjectPhases";
import ProjectDocuments from "../pages/Project/ProjectDocuments";

import Equipments from "../pages/Equipments/Equipments";
import EquipmentUsage from "../pages/Equipments/EquipmentUsage";
import EquipmentMaintenance from "../pages/Equipments/EquipmentMaintenance";
import EquipmentDocuments from "../pages/Equipments/EquipmentDocuments";

import Contracts from "../pages/Contracts/Contracts";
import ContractMilestones from "../pages/Contracts/ContractMilestones";

import Suppliers from "../pages/Inventory/Suppliers";
import Materials from "../pages/Inventory/Materials";
import PurchaseOrders from "../pages/Inventory/PurchaseOrders";
import PurchaseOrderItems from "../pages/Inventory/PurchaseOrderItems";

import TasksAssignment from "../pages/Tasks/TasksAssignment";
import SiteDailyReports from "../pages/SiteDailyReports/SiteDailyReports";
import SafetyIncident from "../pages/Safety/SafetyIncidents";

import Expenses from "../pages/Expenses/Expenses";
import Invoices from "../pages/Invoices/Invoices";
import CashTransactions from "../pages/CashTransaction/CashTransactions";
import PaymentsInfo from "../pages/PaymentsInfo/PaymentsInfo";

import Notifications from "../pages/Notification/Notifications";
import SystemLogs from "../pages/SystemLogs/SystemLogs";
import SystemSettings from "../pages/Settings/SystemSettings";

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
        <Route
          path="/admin/company/company-documents"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <CompanyDocuments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Department */}
        <Route
          path="/admin/departments/departments-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Departments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Employees */}
        <Route
          path="/admin/employees/employee-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-education-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeEducation />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-documents"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeDocuments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-salary-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeSalaryInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/attendance-shifts"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <AttendanceShifts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-hiring-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeHiringInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-attendance-list"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeAttendanceList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-attendance"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmployeeAttendance />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/employee-salary-payment"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EmpSalaryPayment />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Project */}
        <Route
          path="/admin/clients/clients-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <ClientInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/project-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <ProjectInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/boq-items"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <BoqItems />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/project-phases-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <ProjectPhasesInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/project-documents"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <ProjectDocuments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Inventory */}
        <Route
          path="/admin/inventory/suppliers"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Suppliers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory/materials"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Materials />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory/purchase-orders"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <PurchaseOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory/purchase-order-items"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <PurchaseOrderItems />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Equipments / Machinery */}
        <Route
          path="/admin/equipments/equipments"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Equipments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/equipments/equipments-documents"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EquipmentDocuments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/equipments/equipments-usage"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EquipmentUsage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/equipments/equipment-maintenance"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <EquipmentMaintenance />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Contracts */}
        <Route
          path="/admin/contracts/contracts"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Contracts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contracts/contract-milestones"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <ContractMilestones />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Tasks Assignment */}
        <Route
          path="/admin/tasks/tasks-assignment"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <TasksAssignment />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/site-daily-reports/site-daily-reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <SiteDailyReports />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/safety-incident/safety-incident-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <SafetyIncident />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Financial */}
        <Route
          path="/admin/financial/expenses"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Expenses />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/invoices"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Invoices />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/cash-transactions"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <CashTransactions />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/payments-info"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <PaymentsInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/admin/users/user-list"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <UsersList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system/notifications"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <Notifications />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system/system-settings"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <SystemSettings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system/system-logs"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <SystemLogs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* HR */}
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <HRDashboard />
              </HRLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/departments/departments-inf"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <Departments />
              </HRLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/employees/employee-info"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <EmployeeInfo />
              </HRLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/employees/employee-education-info"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <EmployeeEducation />
              </HRLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees/employee-documents"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <EmployeeDocuments />
              </HRLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees/employee-salary-info"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <EmployeeSalaryInfo />
              </HRLayout>
            </ProtectedRoute>
          }
        />
<Route
          path="/hr/employees/attendance-shifts"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRLayout>
                <AttendanceShifts />
              </HRLayout>
            </ProtectedRoute>
          }
        />



        {/* Financial */}
        <Route
          path="/financial/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Financial"]}>
              <FinancialLayout>
                <FinancialDashboard />
              </FinancialLayout>
            </ProtectedRoute>
          }
        />

        {/* PM */}
        <Route
          path="/pm/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PM"]}>
              <PMLayout>
                <PMDashboard />
              </PMLayout>
            </ProtectedRoute>
          }
        />

        {/* Employee */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeLayout>
                <EmployeeDashboard />
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />

        {/* Client */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientLayout>
                <ClientDashboard />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/system/notifications"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientLayout>
                <Notifications />
              </ClientLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
