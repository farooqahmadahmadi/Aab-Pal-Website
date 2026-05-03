const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("./models/index");

// >>>>>>>>>>> Routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const userRoutes = require("./routes/user.routes");
const websiteLanguageRoutes = require("./routes/websiteLanguage.routes");
const aboutPageRoutes = require("./routes/aboutPage.routes");

const app = express();

// Security - Helmet (FIXED for images & downloads)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS - flexible but controlled
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      // allow defined frontend URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow local/LAN development
      if (
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.") ||
        origin.startsWith("http://127.0.0.1") ||
        origin.startsWith("http://localhost")
      ) {
        return callback(null, true);
      }

      // block unknown origins (more secure than before)
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//API Running Status
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

// >>>>>>>>>>> Routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.use("/api/users", userRoutes);
app.use("/api/languages", websiteLanguageRoutes);
app.use("/api/about-page", aboutPageRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
