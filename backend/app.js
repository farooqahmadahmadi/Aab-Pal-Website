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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;