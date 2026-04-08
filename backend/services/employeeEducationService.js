const EmployeeEducationalInfo = require("../models/EmployeeEducationalInfo");
const EmployeeInfo = require("../models/EmployeeInfo");
const { handleDelete } = require("../utils/deleteHelper");
const logService = require("./systemLogsService");

const EmployeeEducationService = {
  // ===== GET ALL =====
  getAll: async () => {
    return await EmployeeEducationalInfo.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: EmployeeInfo,
          attributes: ["employee_id", "emp_full_name"],
        },
      ],
      order: [["eei_id", "ASC"]],
    });
  },

  // ===== GET BY ID =====
  getById: async (id) => {
    return await EmployeeEducationalInfo.findOne({
      where: { eei_id: id, is_deleted: false },
      include: [
        {
          model: EmployeeInfo,
          attributes: ["employee_id", "emp_full_name"],
        },
      ],
    });
  },

  // ===== CREATE =====
  create: async (data, user = {}) => {
    if (!data.employee_id) throw new Error("employee_id is required");

    const record = await EmployeeEducationalInfo.create(data);

    await logService.createLog({
      user_id: user.user_id || 0,
      action: "CREATE",
      reference_table: "employee_educational_info",
      reference_record_id: record.eei_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  update: async (id, data, user = {}) => {
    const record = await EmployeeEducationalInfo.findByPk(id);

    if (!record || record.is_deleted) throw new Error("Record not found");

    const oldValue = record.toJSON();

    await record.update(data);

    await logService.createLog({
      user_id: user.user_id || 0,
      action: "UPDATE",
      reference_table: "employee_educational_info",
      reference_record_id: record.eei_id,
      old_value: oldValue,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== DELETE (Soft + Hard via helper) =====
  delete: async (id, user = {}) => {
    const record = await EmployeeEducationalInfo.findByPk(id);

    if (!record || record.is_deleted) throw new Error("Record not found");

    const user_id = user.user_id || 0;

    await handleDelete(record, user, "employee_educational_info", user_id);

    return true;
  },
};

module.exports = EmployeeEducationService;
