const EmpSalaryInfo = require("../models/EmpSalaryInfo");
const Employee = require("../models/EmployeeInfo");
const { Op } = require("sequelize");

exports.getAllSalaries = async () => {
    return await EmpSalaryInfo.findAll({
        where: { is_deleted: false },
        include: [
            { model: Employee, attributes: ["employee_id", "emp_full_name"] }
        ],
        order: [["employee_salary_id", "DESC"]]
    });
};

exports.getSalaryById = async (id) => {
    return await EmpSalaryInfo.findByPk(id, {
        include: [
            { model: Employee, attributes: ["employee_id", "emp_full_name"] }
        ]
    });
};

// Create with one-active-record rule
exports.addSalary = async (data) => {
    if (data.is_active) {
        // deactivate other active records for the same employee
        await EmpSalaryInfo.update(
            { is_active: false },
            { where: { employee_id: data.employee_id, is_active: true } }
        );
    }
    return await EmpSalaryInfo.create(data);
};

// Update with one-active-record rule
exports.updateSalary = async (id, data) => {
    const salary = await EmpSalaryInfo.findByPk(id);
    if (!salary) throw new Error("Salary record not found");

    if (data.is_active) {
        await EmpSalaryInfo.update(
            { is_active: false },
            {
                where: {
                    employee_id: salary.employee_id,
                    is_active: true,
                    employee_salary_id: { [Op.ne]: id } // exclude current record
                }
            }
        );
    }
    return await salary.update(data);
};

exports.softDeleteSalary = async (id) => {
    const salary = await EmpSalaryInfo.findByPk(id);
    if (!salary) throw new Error("Salary record not found");
    return await salary.update({ is_deleted: true });
};
