const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/empHiringInfoController");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getAllHiring);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, controller.getHiringById);

// ===== CREATE =====
router.post("/", authMiddleware, controller.addHiring);

// ===== UPDATE =====
router.put("/:id", authMiddleware, controller.updateHiring);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, controller.deleteHiring);

module.exports = router;
