const SafetyIncident = require("../models/SafetyIncidentsInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// GET
exports.getAll = async () => {
  return await SafetyIncident.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.create = async (data, user = {}) => {
  const item = await SafetyIncident.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "safety_incidents_info",
    reference_record_id: item.incident_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// UPDATE
exports.update = async (id, data, user = {}) => {
  const item = await SafetyIncident.findOne({
    where: { incident_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Incident not found");

  const oldValue = item.toJSON();

  await item.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "safety_incidents_info",
    reference_record_id: item.incident_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// DELETE (soft/hard via helper)
exports.remove = async (id, user = {}) => {
  const item = await SafetyIncident.findOne({
    where: { incident_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Incident not found");

  await handleDelete(item, user, "safety_incidents_info", getUserId(user));

  return true;
};
