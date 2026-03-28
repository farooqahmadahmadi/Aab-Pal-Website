const EquipmentUsage = require("../models/EquipmentUsageInfo");

// GET ALL
exports.getAll = async () => {
    return await EquipmentUsage.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.create = async (data) => {
    return await EquipmentUsage.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await EquipmentUsage.findOne({
        where: { equipment_usage_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Record not found");

    await item.update(data);
    return item;
};

// DELETE (Soft)
exports.remove = async (id) => {
    const item = await EquipmentUsage.findOne({
        where: { equipment_usage_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Record not found");

    await item.update({ is_deleted: true });
};
