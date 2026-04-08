const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const EmployeeEducationController = require("../controllers/employeeEducationController");

// ===== GET ALL =====
router.get("/", authMiddleware, EmployeeEducationController.getAll);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, EmployeeEducationController.getById);

// ===== CREATE =====
router.post("/", authMiddleware, EmployeeEducationController.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, EmployeeEducationController.update);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, EmployeeEducationController.delete);

module.exports = router;
