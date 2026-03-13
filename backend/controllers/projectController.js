const ProjectInfo = require("../models/ProjectInfo");

// GET all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
};

// GET project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await ProjectInfo.findByPk(req.params.id);
        if (!project || project.is_deleted) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error fetching project", error });
    }
};

// CREATE project
exports.createProject = async (req, res) => {
    try {
        const project = await ProjectInfo.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error creating project", error });
    }
};

// UPDATE project
exports.updateProject = async (req, res) => {
    try {
        const project = await ProjectInfo.findByPk(req.params.id);
        if (!project || project.is_deleted) {
            return res.status(404).json({ message: "Project not found" });
        }
        await project.update(req.body);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
};

// DELETE project (soft delete)
exports.deleteProject = async (req, res) => {
    try {
        const project = await ProjectInfo.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        await project.update({ is_deleted: true });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
};
