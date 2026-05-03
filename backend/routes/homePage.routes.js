const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// 🔥 reuse existing middleware
const uploadHome = uploadMiddleware.uploadHome;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/homePage.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

router.post("/", authMiddleware, uploadHome.single("section_image"), create);

router.put("/:id", authMiddleware, uploadHome.single("section_image"), update);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
