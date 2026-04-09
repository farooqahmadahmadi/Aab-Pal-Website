const { Op } = require("sequelize");
const EmpSalaryPaymentInfo = require("../models/EmpSalaryPaymentInfo");
const EmpSalaryInfo = require("../models/EmpSalaryInfo");

const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// ===== GET ALL =====
exports.getAllPayments = async () => {
  return EmpSalaryPaymentInfo.findAll({
    where: { is_deleted: false },
    order: [["payment_id", "DESC"]],
    include: [{ model: EmpSalaryInfo, attributes: ["employee_id"] }],
  });
};

// ===== GET BY ID =====
exports.getPaymentById = async (id) => {
  return EmpSalaryPaymentInfo.findOne({
    where: { payment_id: id, is_deleted: false },
  });
};

// ===== CREATE =====
exports.createPayment = async (data, user = {}) => {
  if (!data.employee_salary_id)
    throw new Error("employee_salary_id is required");

  if (!data.salary_month) throw new Error("salary_month is required");

  // Duplicate check
  const existing = await EmpSalaryPaymentInfo.findOne({
    where: {
      employee_salary_id: data.employee_salary_id,
      salary_month: data.salary_month,
      is_deleted: false,
    },
  });

  if (existing)
    throw new Error("Payment for this Employee and Month already exists");

  const salaryInfo = await EmpSalaryInfo.findOne({
    where: {
      employee_salary_id: data.employee_salary_id,
      is_deleted: false,
    },
  });

  if (!salaryInfo) throw new Error("Selected Employee Salary is not found");

  const baseAmount =
    parseFloat(salaryInfo.base_salary || 0) +
    parseFloat(salaryInfo.allowance || 0);

  const bonus = parseFloat(data.salary_bonus || 0);
  const deduction = parseFloat(data.salary_deduction || 0);

  data.paid_amount = baseAmount + bonus - deduction;

  const record = await EmpSalaryPaymentInfo.create(data);

  // 🔥 LOG
  await logService.createLog({
    user_id: user.user_id || 0,
    action: "CREATE",
    reference_table: "emp_salary_payment_info",
    reference_record_id: record.payment_id,
    old_value: null,
    new_value: record.toJSON(),
  });

  return record;
};

// ===== UPDATE =====
exports.updatePayment = async (id, data, user = {}) => {
  const payment = await EmpSalaryPaymentInfo.findOne({
    where: { payment_id: id, is_deleted: false },
  });

  if (!payment) throw new Error("Payment not found");

  const oldValue = payment.toJSON();

  // Duplicate check
  const existing = await EmpSalaryPaymentInfo.findOne({
    where: {
      employee_salary_id: data.employee_salary_id || payment.employee_salary_id,
      salary_month: data.salary_month || payment.salary_month,
      is_deleted: false,
      payment_id: { [Op.ne]: id },
    },
  });

  if (existing)
    throw new Error("Payment for this Employee and Month already exists");

  const salaryInfo = await EmpSalaryInfo.findOne({
    where: {
      employee_salary_id: data.employee_salary_id || payment.employee_salary_id,
      is_deleted: false,
    },
  });

  if (!salaryInfo) throw new Error("Selected Employee Salary is not found");

  const baseAmount =
    parseFloat(salaryInfo.base_salary || 0) +
    parseFloat(salaryInfo.allowance || 0);

  const bonus = parseFloat(data.salary_bonus || payment.salary_bonus || 0);
  const deduction = parseFloat(
    data.salary_deduction || payment.salary_deduction || 0,
  );

  await payment.update({
    employee_salary_id: payment.employee_salary_id,
    salary_month: data.salary_month || payment.salary_month,
    salary_bonus: bonus,
    salary_deduction: deduction,
    paid_amount: baseAmount + bonus - deduction,
    payment_date: data.payment_date || payment.payment_date,
    payment_status: data.payment_status || payment.payment_status,
  });

  // 🔥 LOG
  await logService.createLog({
    user_id: user.user_id || 0,
    action: "UPDATE",
    reference_table: "emp_salary_payment_info",
    reference_record_id: payment.payment_id,
    old_value: oldValue,
    new_value: payment.toJSON(),
  });

  return payment;
};

// ===== DELETE (Soft + Hard via helper) =====
exports.deletePayment = async (id, user = {}) => {
  const payment = await EmpSalaryPaymentInfo.findOne({
    where: { payment_id: id, is_deleted: false },
  });

  if (!payment) throw new Error("Payment not found");

  await handleDelete(
    payment,
    user,
    "emp_salary_payment_info",
    user.user_id || 0,
  );

  return true;
};

// ===== ACTIVE SALARY INFOS =====
exports.getActiveSalaryInfos = async () => {
  return EmpSalaryInfo.findAll({
    where: { is_active: true, is_deleted: false },
    attributes: [
      "employee_salary_id",
      "employee_id",
      "base_salary",
      "allowance",
    ],
  });
};
