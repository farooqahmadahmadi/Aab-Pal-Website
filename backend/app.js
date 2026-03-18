
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
// const authRoutes = require("./routes/authRoutes");

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Static
//app.use("/uploads", express.static("uploads"));

// Routes
//app.use("/api", authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;