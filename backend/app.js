const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("./models/index");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const companyDocumentRoutes = require("./routes/companyDocumentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const employeeEducationRoutes = require("./routes/employeeEducationRoutes");
const employeeDocumentsRoutes = require("./routes/employeeDocumentsRoutes");
const employeeSalaryRoutes = require("./routes/employeeSalaryRoutes");
const attendanceShiftsRoutes = require("./routes/attendanceShiftsInfoRoutes");
const empHiringInfoRoutes = require("./routes/empHiringInfoRoutes");
const attendanceRoutes = require("./routes/employeeAttendanceRoutes");
const empSalaryPaymentRoutes = require("./routes/empSalaryPaymentRoutes");
const clientRoutes = require("./routes/clientInfoRoutes");
const projectInfoRoutes = require("./routes/projectInfoRoutes");
const projectPhasesRoutes = require("./routes/projectPhasesRoutes");
const projectDocumentRoutes = require("./routes/projectDocumentRoutes");
const boqRoutes = require("./routes/boqItemsRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const equipmentUsageRoutes = require("./routes/equipmentUsageRoutes");
const equipmentMaintenanceRoutes = require("./routes/equipmentMaintenanceRoutes");
const equipmentDocumentsRoutes = require("./routes/equipmentDocumentsRoutes");
const contractRoutes = require("./routes/contractRoutes");
const milestoneRoutes = require("./routes/contractMilestoneRoutes");
const suppliersRoutes = require("./routes/suppliersRoutes");
const materialsRoutes = require("./routes/materialsRoutes");
const purchaseOrdersRoutes = require("./routes/purchaseOrdersRoutes");
const purchaseOrderItemsRoutes = require("./routes/purchaseOrderItemsRoutes");
const tasksRoutes = require("./routes/tasksAssignmentRoutes");






const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/company-documents", companyDocumentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee-educational-info", employeeEducationRoutes);
app.use("/api/employee-documents", employeeDocumentsRoutes);
app.use("/api/employee-salary", employeeSalaryRoutes);
app.use("/api/attendance-shifts-info", attendanceShiftsRoutes);
app.use("/api/emp-hiring-info", empHiringInfoRoutes);
app.use("/api/employee-attendance", attendanceRoutes);
app.use("/api/payments", empSalaryPaymentRoutes);
app.use("/api/client-info", clientRoutes);
app.use("/api/project-info", projectInfoRoutes);
app.use("/api/project-phases", projectPhasesRoutes);
app.use("/api/project-documents", projectDocumentRoutes);
app.use("/api/boq-items", boqRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/equipment-usage", equipmentUsageRoutes);
app.use("/api/equipment-maintenance", equipmentMaintenanceRoutes);
app.use("/api/equipment-documents", equipmentDocumentsRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/contract-milestones", milestoneRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/purchase-orders", purchaseOrdersRoutes);
app.use("/api/purchase-order-items", purchaseOrderItemsRoutes);
app.use("/api/tasks", tasksRoutes);




// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;