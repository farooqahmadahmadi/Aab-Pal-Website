const EmployeeEducationalInfo = require("../models/EmployeeEducationalInfo");
const EmployeeInfo = require("../models/EmployeeInfo");

const EmployeeEducationService = {
    getAll: async () => { return EmployeeEducationalInfo.findAll({ where: { is_deleted: false }, include: [{ model: EmployeeInfo, attributes: ["employee_id", "emp_full_name"] }], order: [["eei_id", "ASC"]] }); },

    getById: async (id) => { return EmployeeEducationalInfo.findOne({ where: { eei_id: id, is_deleted: false }, include: [{ model: EmployeeInfo, attributes: ["employee_id", "emp_full_name"] }] }); },

    // Ensure employee_id is number
    create: async (data) => { if (!data.employee_id) throw new Error("employee_id is required"); return EmployeeEducationalInfo.create(data); },

    update: async (id, data) => { await EmployeeEducationalInfo.update(data, { where: { eei_id: id } }); return EmployeeEducationalInfo.findByPk(id); },

    delete: async (id) => { await EmployeeEducationalInfo.update({ is_deleted: true }, { where: { eei_id: id } }); }
};

module.exports = EmployeeEducationService;



