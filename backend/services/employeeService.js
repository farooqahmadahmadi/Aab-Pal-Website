const EmployeeInfo = require("../models/EmployeeInfo");

const EmployeeService = {
    getAll: async () => EmployeeInfo.findAll({ where: { is_deleted: false } }),
    getById: async (id) => EmployeeInfo.findOne({ where: { employee_id: id, is_deleted: false } }),
    create: async (data) => EmployeeInfo.create(data),
    update: async (id, data) => EmployeeInfo.update(data, { where: { employee_id: id } }),
    delete: async (id) => EmployeeInfo.update({ is_deleted: true }, { where: { employee_id: id } })
};

module.exports = EmployeeService;