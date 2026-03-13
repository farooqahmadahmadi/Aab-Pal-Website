require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ===== SECURITY =====
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// ===== BODY PARSER =====
app.use(express.json());

// ===== RATE LIMIT =====
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);


// ===== ROUTES =====
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const companyInfoRoutes = require("./routes/companyInfoRoutes");
app.use("/api/company-info", companyInfoRoutes);

const companyDocumentRoutes = require("./routes/companyDocumentRoutes");
app.use("/api/company-documents", companyDocumentRoutes);

const departmentInfoRoutes = require("./routes/departmentInfoRoutes");
app.use("/api/departments", departmentInfoRoutes);

const employeeInfoRoutes = require("./routes/employeeInfoRoutes");
app.use("/api/employees", employeeInfoRoutes);

const employeeDocumentsRoutes = require("./routes/employeeDocumentsRoutes");
app.use("/api/employee-documents", employeeDocumentsRoutes);

const employeeEducationalRoutes = require("./routes/employeeEducationalRoutes");
app.use("/api/employee-education", employeeEducationalRoutes);

const empSalaryRoutes = require("./routes/empSalaryRoutes");
app.use("/api/employee-salary", empSalaryRoutes);

const attendanceShiftRoutes = require("./routes/attendanceShiftRoutes");
app.use("/api/attendance-shifts", attendanceShiftRoutes);

const empHiringRoutes = require("./routes/empHiringRoutes");
app.use("/api/emp-hiring", empHiringRoutes);

const empAttendanceRoutes = require("./routes/empAttendanceRoutes");
app.use("/api/emp-attendance", empAttendanceRoutes);

const empAttendSummaryRoutes = require("./routes/empAttendSummaryRoutes");
app.use("/api/emp-attend-summary", empAttendSummaryRoutes);

const empSalaryPaymentRoutes = require("./routes/empSalaryPaymentRoutes");
app.use("/api/emp-salary-payment", empSalaryPaymentRoutes);

const clientRoutes = require("./routes/clientRoutes");
app.use("/api/clients", clientRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const projectPhasesRoutes = require("./routes/projectPhasesRoutes");
app.use("/api/project-phases", projectPhasesRoutes);

const projectDocumentsRoutes = require("./routes/projectDocumentsRoutes");
app.use("/api/project-documents", projectDocumentsRoutes);

const equipmentRoutes = require("./routes/equipmentRoutes");
app.use("/api/equipment", equipmentRoutes);

const equipmentMaintenanceRoutes = require("./routes/equipmentMaintenanceRoutes");
app.use("/api/equipment-maintenance", equipmentMaintenanceRoutes);

const equipmentUsageRoutes = require("./routes/equipmentUsageRoutes");
app.use("/api/equipment-usage", equipmentUsageRoutes);

const suppliersRoutes = require("./routes/suppliersRoutes");
app.use("/api/suppliers", suppliersRoutes);

const materialsRoutes = require("./routes/materialsRoutes");
app.use("/api/materials", materialsRoutes);

const purchaseOrdersRoutes = require("./routes/purchaseOrdersRoutes");
app.use("/api/purchase-orders", purchaseOrdersRoutes);

const purchaseOrderItemsRoutes = require("./routes/purchaseOrderItemsRoutes");
app.use("/api/purchase-order-items", purchaseOrderItemsRoutes);

const stockTransactionsRoutes = require("./routes/stockTransactionsRoutes");
app.use("/api/stock-transactions", stockTransactionsRoutes);

const contractRoutes = require("./routes/contractRoutes");
app.use("/api/contracts", contractRoutes);

const contractMilestonesRoutes = require("./routes/contractMilestonesRoutes");
app.use("/api/contract-milestones", contractMilestonesRoutes);

const boqItemsRoutes = require("./routes/boqItemsRoutes");
app.use("/api/boq-items", boqItemsRoutes);

const tasksAssignmentRoutes = require("./routes/tasksAssignmentRoutes");
app.use("/api/tasks", tasksAssignmentRoutes);

const siteDailyReportsRoutes = require("./routes/siteDailyReportsRoutes");
app.use("/api/site-reports", siteDailyReportsRoutes);

const safetyIncidentsRoutes = require("./routes/safetyIncidentsRoutes");
app.use("/api/safety-incidents", safetyIncidentsRoutes);

const expensesRoutes = require("./routes/expensesRoutes");
app.use("/api/expenses", expensesRoutes);

const invoicesRoutes = require("./routes/invoicesRoutes");
app.use("/api/invoices", invoicesRoutes);

const cashTransactionsRoutes = require("./routes/cashTransactionsRoutes");
app.use("/api/cash-transactions", cashTransactionsRoutes);

const paymentsRoutes = require("./routes/paymentsRoutes");
app.use("/api/payments", paymentsRoutes);

const notificationsRoutes = require("./routes/notificationsRoutes");
app.use("/api/notifications", notificationsRoutes);







// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;