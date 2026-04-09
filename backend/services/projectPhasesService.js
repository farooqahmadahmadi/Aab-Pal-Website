const ProjectPhasesInfo = require("../models/ProjectPhasesInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

//  helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// ===== GET ALL =====
const getAllPhases = async () => {
  return await ProjectPhasesInfo.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// ===== GET BY ID =====
const getPhaseById = async (id) => {
  return await ProjectPhasesInfo.findOne({
    where: { phase_id: id, is_deleted: false },
  });
};

// ===== CREATE =====
const addPhase = async (data, user = {}) => {
  const phase = await ProjectPhasesInfo.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "project_phases_info",
    reference_record_id: phase.phase_id,
    old_value: null,
    new_value: phase.toJSON(),
  });

  return phase;
};

// ===== UPDATE =====
const updatePhase = async (id, data, user = {}) => {
  const phase = await ProjectPhasesInfo.findOne({
    where: { phase_id: id, is_deleted: false },
  });

  if (!phase) throw new Error("Phase not found");

  const oldValue = phase.toJSON();

  await phase.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "project_phases_info",
    reference_record_id: phase.phase_id,
    old_value: oldValue,
    new_value: phase.toJSON(),
  });

  return phase;
};

// ===== DELETE (Soft + Hard via helper) =====
const deletePhase = async (id, user = {}) => {
  const phase = await ProjectPhasesInfo.findOne({
    where: { phase_id: id, is_deleted: false },
  });

  if (!phase) throw new Error("Phase not found");

  await handleDelete(
    phase,
    user,
    "project_phases_info",
    getUserId(user)
  );

  return true;
};

module.exports = {
  getAllPhases,
  getPhaseById,
  addPhase,
  updatePhase,
  deletePhase,
};