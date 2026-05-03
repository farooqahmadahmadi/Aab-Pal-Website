const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadAbout = uploadMiddleware.uploadAbout;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/aboutPage.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

router.post("/", authMiddleware, uploadAbout.single("about_image"), create);

router.put("/:id", authMiddleware, uploadAbout.single("about_image"), update);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
