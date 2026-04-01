const Invoices = require("../models/InvoicesInfo");

// GET
exports.getAll = async () => {
    return await Invoices.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.create = async (data) => {
    return await Invoices.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await Invoices.findOne({
        where: { invoice_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Invoice not found");

    await item.update(data);
    return item;
};

// DELETE (soft)
exports.remove = async (id) => {
    const item = await Invoices.findOne({
        where: { invoice_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Invoice not found");

    await item.update({ is_deleted: true });
};
