const ExpensesInfo = require("../models/ExpensesInfo");

// GET all expenses
exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await ExpensesInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error });
    }
};

// GET expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await ExpensesInfo.findByPk(req.params.id);
        if (!expense || expense.is_deleted) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error fetching expense", error });
    }
};

// CREATE expense
exports.createExpense = async (req, res) => {
    try {
        const expense = await ExpensesInfo.create(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error creating expense", error });
    }
};

// UPDATE expense
exports.updateExpense = async (req, res) => {
    try {
        const expense = await ExpensesInfo.findByPk(req.params.id);
        if (!expense || expense.is_deleted) {
            return res.status(404).json({ message: "Expense not found" });
        }
        await expense.update(req.body);
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error updating expense", error });
    }
};

// DELETE expense (soft delete)
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await ExpensesInfo.findByPk(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        await expense.update({ is_deleted: true });
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense", error });
    }
};
