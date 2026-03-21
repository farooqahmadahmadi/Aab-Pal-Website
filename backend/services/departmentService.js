const Department = require("../models/DepartmentInfo");

exports.getDepartments = async () => {
    return await Department.findAll({ order: [["created_at", "DESC"]] });
};

exports.createDepartment = async (data) => {
    return await Department.create(data);
};

exports.updateDepartment = async (id, data) => {
    const dept = await Department.findByPk(id);
    if (!dept) throw new Error("Department not found");

    return await dept.update(data);
};

exports.deleteDepartment = async (id) => {
    const dept = await Department.findByPk(id);
    if (!dept) throw new Error("Department not found");

    await dept.destroy();
};
