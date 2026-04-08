const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const EmployeeController = require("../controllers/employeeController");

// ===== GET ALL =====
router.get("/", authMiddleware, EmployeeController.getAll);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, EmployeeController.getById);

// ===== CREATE =====
router.post("/", authMiddleware, EmployeeController.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, EmployeeController.update);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, EmployeeController.delete);

module.exports = router;
