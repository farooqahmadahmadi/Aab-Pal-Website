const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/projectPhasesController");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getPhases);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, controller.getPhase);

// ===== CREATE =====
router.post("/", authMiddleware, controller.createPhase);

// ===== UPDATE =====
router.put("/:id", authMiddleware, controller.updatePhase);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, controller.deletePhase);

module.exports = router;
