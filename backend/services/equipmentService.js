const Equipment = require("../models/EquipmentInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// ===== GET ALL =====
exports.getEquipments = async () => {
  return await Equipment.findAll({
    where: { is_deleted: false },
    order: [["equipment_id", "DESC"]],
  });
};

// ===== CREATE =====
exports.createEquipment = async (data, user = {}) => {
  const item = await Equipment.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "equipment_info",
    reference_record_id: item.equipment_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// ===== UPDATE =====
exports.updateEquipment = async (id, data, user = {}) => {
  const item = await Equipment.findOne({
    where: { equipment_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Equipment not found");

  const oldValue = item.toJSON();

  await item.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "equipment_info",
    reference_record_id: item.equipment_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// ===== DELETE (Soft + Hard via helper) =====
exports.deleteEquipment = async (id, user = {}) => {
  const item = await Equipment.findOne({
    where: { equipment_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Equipment not found");

  await handleDelete(
    item,
    user,
    "equipment_info",
    getUserId(user)
  );

  return true;
};