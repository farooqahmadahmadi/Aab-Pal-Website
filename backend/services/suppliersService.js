const Supplier = require("../models/SuppliersInfo");

// GET
exports.getSuppliers = async () => {
    return await Supplier.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createSupplier = async (data) => {
    return await Supplier.create(data);
};

// UPDATE
exports.updateSupplier = async (id, data) => {
    const item = await Supplier.findOne({
        where: { supplier_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Supplier not found");

    await item.update(data);
    return item;
};

// DELETE (soft)
exports.deleteSupplier = async (id) => {
    const item = await Supplier.findOne({
        where: { supplier_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Supplier not found");

    await item.update({ is_deleted: true });
};
