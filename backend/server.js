require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Database connection
const db = require("./config/db");

// Routes
// const departmentRoutes = require("./routes/department");
const userRoutes = require("./routes/userRoutes"); // د User module

// Initialize app
const app = require("./app");

// ===== SECURITY MIDDLEWARE =====
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // که frontend URL نه وي ورکړل شوی
  })
);
app.use(express.json());

// ===== RATE LIMIT =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
});
app.use(limiter);

// ===== ROUTES =====
app.use("/api/users", userRoutes);
// app.use("/api/departments", departmentRoutes);

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));