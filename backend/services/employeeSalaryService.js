const EmpSalaryInfo = require("../models/EmpSalaryInfo");
const Employee = require("../models/EmployeeInfo");
const { Op } = require("sequelize");
const { handleDelete } = require("../utils/deleteHelper");
const logService = require("./systemLogsService");

// ===== GET ALL SALARIES =====
exports.getAllSalaries = async () => {
  return await EmpSalaryInfo.findAll({
    where: { is_deleted: false },
    include: [
      { model: Employee, attributes: ["employee_id", "emp_full_name"] },
    ],
    order: [["employee_salary_id", "DESC"]],
  });
};

// ===== GET SALARY BY ID =====
exports.getSalaryById = async (id) => {
  return await EmpSalaryInfo.findByPk(id, {
    include: [
      { model: Employee, attributes: ["employee_id", "emp_full_name"] },
    ],
  });
};

// ===== CREATE SALARY (One Active Record) =====
exports.addSalary = async (data, user = {}) => {
  if (data.is_active) {
    await EmpSalaryInfo.update(
      { is_active: false },
      { where: { employee_id: data.employee_id, is_active: true } },
    );
  }
  const record = await EmpSalaryInfo.create(data);

  await logService.createLog({
    user_id: user.user_id || 0,
    action: "CREATE",
    reference_table: "emp_salary_info",
    reference_record_id: record.employee_salary_id,
    old_value: null,
    new_value: record.toJSON(),
  });

  return record;
};

// ===== UPDATE SALARY =====
exports.updateSalary = async (id, data, user = {}) => {
  const salary = await EmpSalaryInfo.findByPk(id);
  if (!salary || salary.is_deleted) throw new Error("Salary record not found");

  if (data.is_active) {
    await EmpSalaryInfo.update(
      { is_active: false },
      {
        where: {
          employee_id: salary.employee_id,
          is_active: true,
          employee_salary_id: { [Op.ne]: id },
        },
      },
    );
  }

  const oldValue = salary.toJSON();
  await salary.update(data);

  await logService.createLog({
    user_id: user.user_id || 0,
    action: "UPDATE",
    reference_table: "emp_salary_info",
    reference_record_id: salary.employee_salary_id,
    old_value: oldValue,
    new_value: salary.toJSON(),
  });

  return salary;
};

// ===== SOFT / HARD DELETE =====
exports.deleteSalary = async (id, user = {}) => {
  const salary = await EmpSalaryInfo.findByPk(id);
  if (!salary || salary.is_deleted) throw new Error("Salary record not found");

  await handleDelete(salary, user, "emp_salary_info", user.user_id || 0);

  return true;
};
