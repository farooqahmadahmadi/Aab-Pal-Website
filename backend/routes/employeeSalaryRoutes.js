const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  listSalaries,
  getSalary,
  createSalary,
  editSalary,
  deleteSalary,
} = require("../controllers/employeeSalaryController");

// ===== GET ALL =====
router.get("/", authMiddleware, listSalaries);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, getSalary);

// ===== CREATE =====
router.post("/", authMiddleware, createSalary);

// ===== EDIT =====
router.put("/:id", authMiddleware, editSalary);

// ===== DELETE =====
router.delete("/:id", authMiddleware, deleteSalary);

module.exports = router;
