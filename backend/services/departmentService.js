const Department = require("../models/DepartmentInfo");
const logService = require("./systemLogsService");

// ===== GET all =====
exports.getDepartments = async () => {
    return await Department.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]],
    });
};

// ===== CREATE =====
exports.createDepartment = async (data, user_id = 0) => {
    const dept = await Department.create(data);

    // 🔥 LOG
    await logService.createLog({
        user_id,
        action: "CREATE",
        reference_table: "departments",
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
    const updated = await dept.update(data);

    // 🔥 LOG
    await logService.createLog({
        user_id,
        action: "UPDATE",
        reference_table: "departments",
        reference_record_id: dept.department_id,
        old_value: oldValue,
        new_value: updated.toJSON(),
    });

    return updated;
};

// ===== DELETE (Soft + Hard) =====
exports.deleteDepartment = async (id, user, user_id = 0) => {
    const dept = await Department.findOne({
        where: { department_id: id, is_deleted: false },
    });

    if (!dept) throw new Error("Department not found");

    const oldValue = dept.toJSON();

    // ✅ HardDelete only if role is exactly "Admin"
    if (user?.role === "Admin") {
        // 🔴 HARD DELETE
        await dept.destroy();

        await logService.createLog({
            user_id,
            action: "HARD_DELETE",
            reference_table: "departments",
            reference_record_id: id,
            old_value: oldValue,
            new_value: null,
        });
    } else {
        // 🟢 SOFT DELETE
        await dept.update({ is_deleted: true });

        await logService.createLog({
            user_id,
            action: "SOFT_DELETE",
            reference_table: "departments",
            reference_record_id: id,
            old_value: oldValue,
            new_value: null,
        });
    }

    return true;
};