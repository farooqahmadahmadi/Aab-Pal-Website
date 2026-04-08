const EmployeeInfo = require("../models/EmployeeInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// ===== GET ALL =====
exports.getAll = async () => {
  return await EmployeeInfo.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// ===== GET BY ID =====
exports.getById = async (id) => {
  return await EmployeeInfo.findOne({
    where: { employee_id: id, is_deleted: false },
  });
};

// ===== CREATE =====
exports.create = async (data, user_id = 0) => {
  const emp = await EmployeeInfo.create(data);

  await logService.createLog({
    user_id,
    action: "CREATE",
    reference_table: "employees",
    reference_record_id: emp.employee_id,
    old_value: null,
    new_value: emp.toJSON(),
  });

  return emp;
};

// ===== UPDATE =====
exports.update = async (id, data, user_id = 0) => {
  const emp = await EmployeeInfo.findOne({
    where: { employee_id: id, is_deleted: false },
  });

  if (!emp) throw new Error("Employee not found");

  const oldValue = emp.toJSON();

  await emp.update(data);

  await logService.createLog({
    user_id,
    action: "UPDATE",
    reference_table: "employees",
    reference_record_id: emp.employee_id,
    old_value: oldValue,
    new_value: emp.toJSON(),
  });

  return emp;
};

// ===== DELETE (using helper) =====
exports.delete = async (id, user) => {
  const emp = await EmployeeInfo.findOne({
    where: { employee_id: id, is_deleted: false },
  });

  if (!emp) throw new Error("Employee not found");

  await handleDelete(emp, user, "employees", user?.user_id || 0);

  return true;
};
