const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Login route
router.post("/login", login);

// Logout route (protected)
router.post("/logout", authMiddleware, logout);

module.exports = router;
