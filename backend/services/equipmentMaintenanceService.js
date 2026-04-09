const EquipmentMaintenance = require("../models/EquipmentMaintenanceInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

const EquipmentMaintenanceService = {
  // ===== GET ALL =====
  getMaintenances: async () => {
    return await EquipmentMaintenance.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },

  // ===== CREATE =====
  createMaintenance: async (data, user = {}) => {
    const record = await EquipmentMaintenance.create(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "equipment_maintenance_info",
      reference_record_id: record.equip_maintenance_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  updateMaintenance: async (id, data, user = {}) => {
    const item = await EquipmentMaintenance.findOne({
      where: { equip_maintenance_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Maintenance record not found");

    const oldValue = item.toJSON();

    await item.update(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "equipment_maintenance_info",
      reference_record_id: item.equip_maintenance_id,
      old_value: oldValue,
      new_value: item.toJSON(),
    });

    return item;
  },

  // ===== DELETE (Soft + Hard via helper) =====
  deleteMaintenance: async (id, user = {}) => {
    const item = await EquipmentMaintenance.findOne({
      where: { equip_maintenance_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Maintenance record not found");

    await handleDelete(
      item,
      user,
      "equipment_maintenance_info",
      getUserId(user)
    );

    return true;
  },
};

module.exports = EquipmentMaintenanceService;