const StockTransaction = require("../models/StockTransactionsInfo");

// GET ALL
exports.getTransactions = async () => {
    return await StockTransaction.findAll({
        where: { is_deleted: false },
        order: [["stock_transaction_date", "DESC"]]
    });
};

// CREATE
exports.createTransaction = async (data) => {
    return await StockTransaction.create(data);
};

// UPDATE
exports.updateTransaction = async (id, data) => {
    const txn = await StockTransaction.findOne({
        where: { stock_transaction_id: id, is_deleted: false }
    });

    if (!txn) throw new Error("Transaction not found");

    await txn.update(data);
    return txn;
};

// DELETE (soft delete)
exports.deleteTransaction = async (id) => {
    const txn = await StockTransaction.findOne({
        where: { stock_transaction_id: id, is_deleted: false }
    });

    if (!txn) throw new Error("Transaction not found");

    await txn.update({ is_deleted: true });
};
