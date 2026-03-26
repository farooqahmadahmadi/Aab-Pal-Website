
const { Op } = require("sequelize");
const EmpSalaryPaymentInfo = require("../models/EmpSalaryPaymentInfo");
const EmpSalaryInfo = require("../models/EmpSalaryInfo");

// Get all payments (excluding deleted)
exports.getAllPayments = async () => {
    return EmpSalaryPaymentInfo.findAll({
        where: { is_deleted: false },
        order: [["payment_id", "DESC"]],
        include: [{ model: EmpSalaryInfo, attributes: ["employee_id"] }]
    });
};

// Create payment
exports.createPayment = async (data) => {
    if (!data.employee_salary_id) throw new Error("employee_salary_id is required");
    if (!data.salary_month) throw new Error("salary_month is required");

    // ✅ Duplicate prevention per Employee per Month
    const existing = await EmpSalaryPaymentInfo.findOne({
        where: {
            employee_salary_id: data.employee_salary_id,
            salary_month: data.salary_month,
            is_deleted: false
        }
    });
    if (existing) throw new Error("Payment for this Employee and Month already exists");

    const salaryInfo = await EmpSalaryInfo.findOne({
        where: { employee_salary_id: data.employee_salary_id, is_deleted: false }
    });
    if (!salaryInfo) throw new Error("Selected Employee Salary is not found");

    const baseAmount = parseFloat(salaryInfo.base_salary || 0) + parseFloat(salaryInfo.allowance || 0);
    const bonus = parseFloat(data.salary_bonus || 0);
    const deduction = parseFloat(data.salary_deduction || 0);
    data.paid_amount = baseAmount + bonus - deduction;

    return EmpSalaryPaymentInfo.create(data);
};

// Update payment
exports.updatePayment = async (id, data) => {
    const payment = await EmpSalaryPaymentInfo.findOne({ where: { payment_id: id, is_deleted: false } });
    if (!payment) return null;

    // ✅ Duplicate check per Employee per Month, exclude self
    const existing = await EmpSalaryPaymentInfo.findOne({
        where: {
            employee_salary_id: data.employee_salary_id || payment.employee_salary_id,
            salary_month: data.salary_month || payment.salary_month,
            is_deleted: false,
            payment_id: { [Op.ne]: id }
        }
    });
    if (existing) throw new Error("Payment for this Employee and Month already exists");

    const salaryInfo = await EmpSalaryInfo.findOne({
        where: { employee_salary_id: data.employee_salary_id || payment.employee_salary_id, is_deleted: false }
    });
    if (!salaryInfo) throw new Error("Selected Employee Salary is not found");

    const baseAmount = parseFloat(salaryInfo.base_salary || 0) + parseFloat(salaryInfo.allowance || 0);
    const bonus = parseFloat(data.salary_bonus || payment.salary_bonus || 0);
    const deduction = parseFloat(data.salary_deduction || payment.salary_deduction || 0);

    return payment.update({
        employee_salary_id: payment.employee_salary_id, // ✅ Preserve original salary_id for edit
        salary_month: data.salary_month || payment.salary_month,
        salary_bonus: bonus,
        salary_deduction: deduction,
        paid_amount: baseAmount + bonus - deduction,
        payment_date: data.payment_date || payment.payment_date,
        payment_status: data.payment_status || payment.payment_status
    });
};

// Soft delete payment
exports.deletePayment = async (id) => {
    const payment = await EmpSalaryPaymentInfo.findOne({ where: { payment_id: id, is_deleted: false } });
    if (!payment) return null;
    return payment.update({ is_deleted: true });
};

// Get active EmployeeSalaryInfo
exports.getActiveSalaryInfos = async () => {
    return EmpSalaryInfo.findAll({
        where: { is_active: true, is_deleted: false },
        attributes: ["employee_salary_id", "employee_id", "base_salary", "allowance"]
    });
};