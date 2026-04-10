const Milestone = require("../models/ContractMilestonesInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// GET
exports.getMilestones = async () => {
  return await Milestone.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.createMilestone = async (data, user = {}) => {
  const item = await Milestone.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "contract_milestones_info",
    reference_record_id: item.milestone_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// UPDATE
exports.updateMilestone = async (id, data, user = {}) => {
  const item = await Milestone.findOne({
    where: { milestone_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Milestone not found");

  const oldValue = item.toJSON();

  await item.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "contract_milestones_info",
    reference_record_id: item.milestone_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// DELETE (soft/hard via helper)
exports.deleteMilestone = async (id, user = {}) => {
  const item = await Milestone.findOne({
    where: { milestone_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Milestone not found");

  await handleDelete(item, user, "contract_milestones_info", getUserId(user));

  return true;
};
