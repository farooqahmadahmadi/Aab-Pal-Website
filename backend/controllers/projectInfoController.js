const ProjectService = require("../services/projectInfoService");

// ===== GET ALL =====
const getProjects = async (req, res) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// ===== GET BY ID =====
const getProjectById = async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("GET PROJECT ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// ===== CREATE =====
const createProject = async (req, res) => {
  try {
    const user = req.user;

    const project = await ProjectService.addProject(req.body, user);

    res.status(201).json(project);
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to create project",
    });
  }
};

// ===== UPDATE =====
const updateProject = async (req, res) => {
  try {
    const user = req.user;

    const project = await ProjectService.updateProject(
      req.params.id,
      req.body,
      user,
    );

    res.json(project);
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to update project",
    });
  }
};

// ===== DELETE =====
const deleteProjectCtrl = async (req, res) => {
  try {
    const user = req.user;

    await ProjectService.deleteProject(req.params.id, user);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to delete project",
    });
  }
};

// ===== DROPDOWNS =====
const getClientsDropdown = async (req, res) => {
  try {
    const clients = await ProjectService.getClients();
    res.json(clients);
  } catch (err) {
    console.error("GET CLIENTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

const getEmployeesDropdown = async (req, res) => {
  try {
    const employees = await ProjectService.getEmployees();
    res.json(employees);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject: deleteProjectCtrl,
  getClientsDropdown,
  getEmployeesDropdown,
};
