const EquipmentMaintenance = require("../models/EquipmentMaintenanceInfo");

// GET ALL
exports.getMaintenances = async () => {
    return await EquipmentMaintenance.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createMaintenance = async (data) => {
    return await EquipmentMaintenance.create(data);
};

// UPDATE
exports.updateMaintenance = async (id, data) => {
    const item = await EquipmentMaintenance.findOne({
        where: { equip_maintenance_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Maintenance record not found");

    await item.update(data);
    return item;
};

// DELETE (Soft Delete)
exports.deleteMaintenance = async (id) => {
    const item = await EquipmentMaintenance.findOne({
        where: { equip_maintenance_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Maintenance record not found");

    await item.update({ is_deleted: true });
};