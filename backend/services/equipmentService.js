const Equipment = require("../models/EquipmentInfo");

// GET ALL
exports.getEquipments = async () => {
    return await Equipment.findAll({
        where: { is_deleted: false },
        order: [["equipment_id", "DESC"]]
    });
};

// CREATE
exports.createEquipment = async (data) => {
    return await Equipment.create(data);
};

// UPDATE
exports.updateEquipment = async (id, data) => {
    const item = await Equipment.findOne({
        where: { equipment_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Equipment not found");

    await item.update(data);
    return item;
};

// DELETE (Soft Delete)
exports.deleteEquipment = async (id) => {
    const item = await Equipment.findOne({
        where: { equipment_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Equipment not found");

    await item.update({ is_deleted: true });
};