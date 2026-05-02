const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

// 🔥 upload (later fix)
const uploadMiddleware = require("../middlewares/upload.middleware");
const uploadUser = uploadMiddleware.uploadUser;

const {
  login,
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/user.controller");

// AUTH
router.post("/login", login);

// USERS
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getOne);

// CREATE + PHOTO
router.post(
  "/",
  authMiddleware,
  uploadUser.single("user_photo"),
  create
);

// UPDATE + PHOTO
router.put(
  "/:id",
  authMiddleware,
  uploadUser.single("user_photo"),
  update
);

// DELETE
router.delete("/:id", authMiddleware, remove);

module.exports = router;