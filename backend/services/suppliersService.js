const Supplier = require("../models/SuppliersInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

const SuppliersService = {
  // ===== GET =====
  getSuppliers: async () => {
    return await Supplier.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },

  // ===== CREATE =====
  createSupplier: async (data, user = {}) => {
    const record = await Supplier.create(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "suppliers_info",
      reference_record_id: record.supplier_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  updateSupplier: async (id, data, user = {}) => {
    const item = await Supplier.findOne({
      where: { supplier_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Supplier not found");

    const oldValue = item.toJSON();

    await item.update(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "suppliers_info",
      reference_record_id: item.supplier_id,
      old_value: oldValue,
      new_value: item.toJSON(),
    });

    return item;
  },

  // ===== DELETE (Soft + Helper) =====
  deleteSupplier: async (id, user = {}) => {
    const item = await Supplier.findOne({
      where: { supplier_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Supplier not found");

    await handleDelete(item, user, "suppliers_info", getUserId(user));

    return true;
  },
};

module.exports = SuppliersService;
