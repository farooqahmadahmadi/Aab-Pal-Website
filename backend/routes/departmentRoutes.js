const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const DepartmentController = require("../controllers/departmentController");

// ===== GET ALL =====
router.get("/", authMiddleware, DepartmentController.getAll);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, DepartmentController.getById);

// ===== CREATE =====
router.post("/", authMiddleware, DepartmentController.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, DepartmentController.update);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, DepartmentController.remove);

module.exports = router;
