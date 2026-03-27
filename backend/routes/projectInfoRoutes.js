const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/projectInfoController");

// CRUD
router.get("/", ProjectController.getProjects);
router.post("/", ProjectController.createProject);
router.put("/:id", ProjectController.updateProject);
router.delete("/:id", ProjectController.deleteProject);

// Dropdowns
router.get("/clients", ProjectController.getClientsDropdown);
router.get("/employees", ProjectController.getEmployeesDropdown);

module.exports = router;

