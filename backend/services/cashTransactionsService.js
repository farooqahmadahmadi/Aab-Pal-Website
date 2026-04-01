const CashTransaction = require("../models/CashTransactionsInfo");

// GET ALL
exports.getAll = async () => {
    return await CashTransaction.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]],
    });
};

// CREATE
exports.create = async (data) => {
    return await CashTransaction.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await CashTransaction.findOne({
        where: { transaction_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Transaction not found");

    await item.update(data);
    return item;
};

// DELETE (soft)
exports.remove = async (id) => {
    const item = await CashTransaction.findOne({
        where: { transaction_id: id, is_deleted: false },
    });

    if (!item) throw new Error("Transaction not found");

    await item.update({ is_deleted: true });
};