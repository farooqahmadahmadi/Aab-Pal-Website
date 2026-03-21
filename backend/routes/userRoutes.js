const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { login, logout, forgotPassword, resetPassword, getUsers,
    getUserById, addUser, updateUser, deleteUser, changePassword, adminResetPassword } = require("../controllers/userController");

// Login route
router.post("/login", login);
// Logout route (protected)
router.post("/logout", authMiddleware, logout);
// Forgot password
router.post("/forgot-password", forgotPassword);
// Reset password with token
router.post("/reset-password/:token", resetPassword);
// Change password (protected)
router.post("/change-password", authMiddleware, changePassword);

// Users List CRUD routes
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.post("/", authMiddleware, addUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

// ✅ Admin reset password to default 12345
router.post("/:id/reset-password", authMiddleware, adminResetPassword);

module.exports = router;