const ProjectInfo = require("../models/ProjectInfo");
const { Op } = require("sequelize");

// Get all projects
const getAllProjects = async () => {
    return await ProjectInfo.findAll({ where: { is_deleted: false } });
};

// Add new project
const addProject = async (data) => {
    return await ProjectInfo.create(data);
};

// Update project
const updateProject = async (id, data) => {
    return await ProjectInfo.update(data, { where: { project_id: id } });
};

// Delete project (soft delete)
const deleteProject = async (id) => {
    return await ProjectInfo.update({ is_deleted: true }, { where: { project_id: id } });
};

// Dropdowns
const getClients = async () => {
    // فرضي: بیا باید ClientInfo model جوړ وي
    const Client = require("../models/ClientInfo");
    return await Client.findAll({ where: { is_deleted: false } });
};

const getEmployees = async () => {
    const Employee = require("../models/EmployeeInfo");
    return await Employee.findAll({ where: { is_deleted: false } });
};

module.exports = {
    getAllProjects,
    addProject,
    updateProject,
    deleteProject,
    getClients,
    getEmployees
};
