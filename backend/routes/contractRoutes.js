const express = require("express");
const router = express.Router();

const { uploadContract } = require("../middlewares/uploadMiddleware");
const ctrl = require("../controllers/contractController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ===== GET ALL =====
router.get("/", ctrl.getAll);

// ===== CREATE =====
router.post("/", authMiddleware, uploadContract.single("file"), ctrl.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, uploadContract.single("file"), ctrl.update);

// ===== DELETE =====
router.delete("/:id", authMiddleware, ctrl.remove);

module.exports = router;
