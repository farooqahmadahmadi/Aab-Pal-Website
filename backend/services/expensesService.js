const Expenses = require("../models/ExpensesInfo");

// GET
exports.getAll = async () => {
    return await Expenses.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.create = async (data) => {
    return await Expenses.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await Expenses.findOne({
        where: { expense_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Expense not found");

    await item.update(data);
    return item;
};

// DELETE (soft delete)
exports.remove = async (id) => {
    const item = await Expenses.findOne({
        where: { expense_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Expense not found");

    await item.update({ is_deleted: true });
};
