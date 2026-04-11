const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");

const uploadMiddleware = require("../middlewares/uploadMiddleware");
const uploadUser = uploadMiddleware.uploadUser;

const {
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  changePassword,
  adminResetPassword,
  uploadUserPhoto,
} = require("../controllers/userController");

// AUTH
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

// PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authMiddleware, changePassword);

// USERS
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);

// CREATE + PHOTO
router.post(
  "/",
  authMiddleware,
  uploadUser.single("user_photo_url"),
  addUser
);

// UPDATE + PHOTO
router.put(
  "/:id",
  authMiddleware,
  uploadUser.single("user_photo_url"),
  updateUser
);

// DELETE
router.delete("/:id", authMiddleware, deleteUser);

// ADMIN RESET
router.post("/:id/reset-password", authMiddleware, adminResetPassword);

// PROFILE PHOTO ONLY
router.post(
  "/:id/photo",
  authMiddleware,
  uploadUser.single("user_photo_url"),
  uploadUserPhoto
);

module.exports = router;