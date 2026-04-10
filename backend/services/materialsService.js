const Material = require("../models/MaterialsInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

const MaterialsService = {
  // ===== GET =====
  getMaterials: async () => {
    return await Material.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },

  // ===== CREATE =====
  createMaterial: async (data, user = {}) => {
    const record = await Material.create(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "materials_info",
      reference_record_id: record.material_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  updateMaterial: async (id, data, user = {}) => {
    const item = await Material.findOne({
      where: { material_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Material not found");

    const oldValue = item.toJSON();

    await item.update(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "materials_info",
      reference_record_id: item.material_id,
      old_value: oldValue,
      new_value: item.toJSON(),
    });

    return item;
  },

  // ===== DELETE (Soft + Helper) =====
  deleteMaterial: async (id, user = {}) => {
    const item = await Material.findOne({
      where: { material_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Material not found");

    await handleDelete(item, user, "materials_info", getUserId(user));

    return true;
  },
};

module.exports = MaterialsService;
