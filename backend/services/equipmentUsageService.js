const EquipmentUsage = require("../models/EquipmentUsageInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// 🔥 helper
const getUserId = (user) => user?.user_id || user?.id || 0;

const EquipmentUsageService = {
  // ===== GET ALL =====
  getAll: async () => {
    return await EquipmentUsage.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },

  // ===== CREATE =====
  create: async (data, user = {}) => {
    const record = await EquipmentUsage.create(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "equipment_usage_info",
      reference_record_id: record.equipment_usage_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  update: async (id, data, user = {}) => {
    const item = await EquipmentUsage.findOne({
      where: { equipment_usage_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Record not found");

    const oldValue = item.toJSON();

    await item.update(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "equipment_usage_info",
      reference_record_id: item.equipment_usage_id,
      old_value: oldValue,
      new_value: item.toJSON(),
    });

    return item;
  },

  // ===== DELETE (Soft + Hard via helper) =====
  remove: async (id, user = {}) => {
    const item = await EquipmentUsage.findOne({
      where: { equipment_usage_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Record not found");

    await handleDelete(
      item,
      user,
      "equipment_usage_info",
      getUserId(user)
    );

    return true;
  },
};

module.exports = EquipmentUsageService;