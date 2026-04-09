const EmpHiringInfo = require("../models/EmpHiringInfo");
const { handleDelete } = require("../utils/deleteHelper");
const logService = require("./systemLogsService");

// ===== EMP HIRING INFO SERVICE =====
const EmpHiringInfoService = {
  // ===== GET ALL =====
  getAll: async () => {
    return await EmpHiringInfo.findAll({
      where: { is_deleted: false },
      order: [["hiring_id", "DESC"]],
    });
  },

  // ===== GET BY ID =====
  getById: async (id) => {
    return await EmpHiringInfo.findOne({
      where: { hiring_id: id, is_deleted: false },
    });
  },

  // ===== CREATE =====
  create: async (data, user = {}) => {
    const record = await EmpHiringInfo.create(data);

    await logService.createLog({
      user_id: user.user_id || 0,
      action: "CREATE",
      reference_table: "emp_hiring_info",
      reference_record_id: record.hiring_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  update: async (id, data, user = {}) => {
    const record = await EmpHiringInfo.findOne({
      where: { hiring_id: id, is_deleted: false },
    });

    if (!record) throw new Error("Record not found");

    const oldValue = record.toJSON();
    await record.update(data);

    await logService.createLog({
      user_id: user.user_id || 0,
      action: "UPDATE",
      reference_table: "emp_hiring_info",
      reference_record_id: record.hiring_id,
      old_value: oldValue,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== DELETE =====
  delete: async (id, user = {}) => {
    const record = await EmpHiringInfo.findOne({
      where: { hiring_id: id, is_deleted: false },
    });

    if (!record) throw new Error("Record not found");

    await handleDelete(record, user, "emp_hiring_info", user.user_id || 0);

    return true;
  },
};

module.exports = EmpHiringInfoService;
