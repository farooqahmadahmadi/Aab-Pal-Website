const Department = require("../models/DepartmentInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// ===== GET ALL =====
exports.getDepartments = async () => {
    return await Department.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]],
    });
};

// ===== GET BY ID =====
exports.getDepartmentById = async (id) => {
    return await Department.findOne({
        where: { department_id: id, is_deleted: false },
    });
};

// ===== CREATE =====
exports.createDepartment = async (data, user_id = 0) => {
    const dept = await Department.create(data);

    await logService.createLog({
        user_id: user_id,
        action: "CREATE",
        reference_table: "department_info",
        reference_record_id: dept.department_id,
        old_value: null,
        new_value: dept.toJSON(),
    });

    return dept;
};

// ===== UPDATE =====
exports.updateDepartment = async (id, data, user_id = 0) => {
    const dept = await Department.findOne({
        where: { department_id: id, is_deleted: false },
    });

    if (!dept) throw new Error("Department not found");

    const oldValue = dept.toJSON();
    await dept.update(data);

    await logService.createLog({
        user_id: user_id,
        action: "UPDATE",
        reference_table: "department_info",
        reference_record_id: dept.department_id,
        old_value: oldValue,
        new_value: dept.toJSON(),
    });

    return dept;
};

// ===== DELETE (Soft + Hard via helper) =====
exports.deleteDepartment = async (id, user) => {
    const dept = await Department.findOne({
        where: { department_id: id, is_deleted: false },
    });

    if (!dept) throw new Error("Department not found");

    await handleDelete(dept, user, "department_info", user?.user_id || 0);

    return true;
};