const ProjectService = require("../services/projectInfoService");

// GET /api/project-info
const getProjects = async (req, res) => {
    try {
        const projects = await ProjectService.getAllProjects();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/project-info
const createProject = async (req, res) => {
    try {
        const project = await ProjectService.addProject(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/project-info/:id
const updateProject = async (req, res) => {
    try {
        await ProjectService.updateProject(req.params.id, req.body);
        res.json({ message: "Project updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/project-info/:id
const deleteProject = async (req, res) => {
    try {
        await ProjectService.deleteProject(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Dropdowns
const getClientsDropdown = async (req, res) => {
    try {
        const clients = await ProjectService.getClients();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEmployeesDropdown = async (req, res) => {
    try {
        const employees = await ProjectService.getEmployees();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getClientsDropdown,
    getEmployeesDropdown
};
