const Material = require("../models/MaterialsInfo");

// GET
exports.getMaterials = async () => {
    return await Material.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createMaterial = async (data) => {
    return await Material.create(data);
};

// UPDATE
exports.updateMaterial = async (id, data) => {
    const item = await Material.findOne({
        where: { material_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Material not found");

    await item.update(data);
    return item;
};

// DELETE (soft)
exports.deleteMaterial = async (id) => {
    const item = await Material.findOne({
        where: { material_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Material not found");

    await item.update({ is_deleted: true });
};
