const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/attendanceShiftsInfoController");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getShifts);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, controller.getShift);

// ===== CREATE =====
router.post("/", authMiddleware, controller.createShift);

// ===== UPDATE =====
router.put("/:id", authMiddleware, controller.updateShift);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, controller.deleteShift);

module.exports = router;
