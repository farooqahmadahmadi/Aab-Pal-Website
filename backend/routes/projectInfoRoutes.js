const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const ProjectController = require("../controllers/projectInfoController");

// ===== DROPDOWNS (must come BEFORE /:id) =====
router.get("/clients", authMiddleware, ProjectController.getClientsDropdown);
router.get("/employees", authMiddleware, ProjectController.getEmployeesDropdown);

// ===== GET ALL =====
router.get("/", authMiddleware, ProjectController.getProjects);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, ProjectController.getProjectById);

// ===== CREATE =====
router.post("/", authMiddleware, ProjectController.createProject);

// ===== UPDATE =====
router.put("/:id", authMiddleware, ProjectController.updateProject);

// ===== DELETE (Soft + Hard via deleteHelper) =====
router.delete("/:id", authMiddleware, ProjectController.deleteProject);

module.exports = router;