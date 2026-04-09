const ProjectInfo = require("../models/ProjectInfo");
const Client = require("../models/ClientInfo");
const Employee = require("../models/EmployeeInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// 🔥 helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// ===== GET ALL =====
const getAllProjects = async () => {
  return await ProjectInfo.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// ===== GET BY ID =====
const getProjectById = async (id) => {
  return await ProjectInfo.findOne({
    where: { project_id: id, is_deleted: false },
  });
};

// ===== CREATE =====
const addProject = async (data, user = {}) => {
  const project = await ProjectInfo.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "project_info",
    reference_record_id: project.project_id,
    old_value: null,
    new_value: project.toJSON(),
  });

  return project;
};

// ===== UPDATE =====
const updateProject = async (id, data, user = {}) => {
  const project = await ProjectInfo.findOne({
    where: { project_id: id, is_deleted: false },
  });

  if (!project) throw new Error("Project not found");

  const oldValue = project.toJSON();

  await project.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "project_info",
    reference_record_id: project.project_id,
    old_value: oldValue,
    new_value: project.toJSON(),
  });

  return project;
};

// ===== DELETE (Soft + Hard via helper) =====
const deleteProject = async (id, user = {}) => {
  const project = await ProjectInfo.findOne({
    where: { project_id: id, is_deleted: false },
  });

  if (!project) throw new Error("Project not found");

  await handleDelete(project, user, "project_info", getUserId(user));

  return true;
};

// ===== DROPDOWNS =====
const getClients = async () => {
  return await Client.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

const getEmployees = async () => {
  return await Employee.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

module.exports = {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
  getClients,
  getEmployees,
};
