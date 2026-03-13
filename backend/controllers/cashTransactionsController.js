const CashTransactions = require("../models/CashTransactionsInfo");

// GET all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await CashTransactions.findAll({ where: { is_deleted: false } });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
};

// GET transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await CashTransactions.findByPk(req.params.id);
        if (!transaction || transaction.is_deleted) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};

// CREATE transaction
exports.createTransaction = async (req, res) => {
    try {
        const transaction = await CashTransactions.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error });
    }
};

// UPDATE transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await CashTransactions.findByPk(req.params.id);
        if (!transaction || transaction.is_deleted) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        await transaction.update(req.body);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
};

// DELETE transaction (soft delete)
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await CashTransactions.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        await transaction.update({ is_deleted: true });
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
};
