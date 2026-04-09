const express = require("express");
const router = express.Router();

const controller = require("../controllers/empHiringInfoController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getAll);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, controller.getById);

// ===== CREATE =====
router.post("/", authMiddleware, controller.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, controller.update);

// ===== DELETE =====
router.delete("/:id", authMiddleware, controller.delete);

module.exports = router;