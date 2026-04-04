const Expenses = require("../models/ExpensesInfo");
const CashTransaction = require("../models/CashTransactionsInfo");
const db = require("../models");

// 🔥 helper: create/update transaction
const syncTransaction = async (expense, type, t) => {
    const amount = parseFloat(expense.expense_amount) || 0;

    // CREATE
    if (type === "create") {
        await CashTransaction.create({
            project_id: expense.project_id || null,
            reference_type: "Expense",
            reference_id: expense.expense_id,
            transaction_type: "Expense",
            amount: amount,
            transaction_description: expense.expense_description || "Expense transaction",
            transaction_date: expense.expense_date || new Date()
        }, { transaction: t });
    }

    // UPDATE
    if (type === "update") {
        const trx = await CashTransaction.findOne({
            where: {
                reference_type: "Expense",
                reference_id: expense.expense_id,
                is_deleted: false
            },
            transaction: t
        });

        if (trx) {
            await trx.update({
                project_id: expense.project_id || null,
                amount: amount,
                transaction_description: expense.expense_description || "Expense transaction",
                transaction_date: expense.expense_date || new Date()
            }, { transaction: t });
        }
    }

    // DELETE
    if (type === "delete") {
        const trx = await CashTransaction.findOne({
            where: {
                reference_type: "Expense",
                reference_id: expense.expense_id,
                is_deleted: false
            },
            transaction: t
        });

        if (trx) {
            await trx.update({ is_deleted: true }, { transaction: t });
        }
    }
};

// GET
exports.getAll = async () => {
    return await Expenses.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.create = async (data) => {
    return await db.sequelize.transaction(async (t) => {
        const expense = await Expenses.create(data, { transaction: t });

        await syncTransaction(expense, "create", t);

        return expense;
    });
};

// UPDATE
exports.update = async (id, data) => {
    return await db.sequelize.transaction(async (t) => {
        const item = await Expenses.findOne({
            where: { expense_id: id, is_deleted: false },
            transaction: t
        });

        if (!item) throw new Error("Expense not found");

        await item.update(data, { transaction: t });

        await syncTransaction(item, "update", t);

        return item;
    });
};

// DELETE (soft delete)
exports.remove = async (id) => {
    return await db.sequelize.transaction(async (t) => {
        const item = await Expenses.findOne({
            where: { expense_id: id, is_deleted: false },
            transaction: t
        });

        if (!item) throw new Error("Expense not found");

        await item.update({ is_deleted: true }, { transaction: t });

        await syncTransaction(item, "delete", t);
    });
};