const Payments = require("../models/PaymentsInfo");

// GET ALL
exports.getAll = async () => {
    return await Payments.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]],
    });
};

// CREATE
exports.create = async (data) => {
    return await Payments.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await Payments.findOne({
        where: { payment_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Payment not found");

    await item.update(data);
    return item;
};

// DELETE (soft)
exports.remove = async (id) => {
    const item = await Payments.findOne({
        where: { payment_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Payment not found");

    await item.update({ is_deleted: true });
};
