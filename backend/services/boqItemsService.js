const Boq = require("../models/BoqItemsInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// 🔥 helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// ===== GET =====
exports.getItems = async () => {
  return await Boq.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// ===== CREATE =====
exports.createItem = async (data, user = {}) => {
  data.total_amount = (data.item_quantity || 0) * (data.unit_price || 0);

  const item = await Boq.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "boq_items_info",
    reference_record_id: item.boq_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// ===== UPDATE =====
exports.updateItem = async (id, data, user = {}) => {
  const item = await Boq.findOne({
    where: { boq_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Item not found");

  const oldValue = item.toJSON();

  data.total_amount = (data.item_quantity || 0) * (data.unit_price || 0);

  await item.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "boq_items_info",
    reference_record_id: item.boq_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// ===== DELETE (Soft + Hard) =====
exports.deleteItem = async (id, user = {}) => {
  const item = await Boq.findOne({
    where: { boq_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Item not found");

  await handleDelete(item, user, "boq_items_info", getUserId(user));

  return true;
};
