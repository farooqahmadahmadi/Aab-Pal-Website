const StockTransactionInfo = require("../models/StockTransactionsInfo");

// GET all stock transactions
exports.getAllStockTransactions = async (req, res) => {
    try {
        const transactions = await StockTransactionInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock transactions", error });
    }
};

// GET stock transaction by ID
exports.getStockTransactionById = async (req, res) => {
    try {
        const transaction = await StockTransactionInfo.findByPk(req.params.id);
        if (!transaction || transaction.is_deleted) {
            return res.status(404).json({ message: "Stock transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock transaction", error });
    }
};

// CREATE stock transaction
exports.createStockTransaction = async (req, res) => {
    try {
        const transaction = await StockTransactionInfo.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error creating stock transaction", error });
    }
};

// UPDATE stock transaction
exports.updateStockTransaction = async (req, res) => {
    try {
        const transaction = await StockTransactionInfo.findByPk(req.params.id);
        if (!transaction || transaction.is_deleted) {
            return res.status(404).json({ message: "Stock transaction not found" });
        }
        await transaction.update(req.body);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error updating stock transaction", error });
    }
};

// DELETE stock transaction (soft delete)
exports.deleteStockTransaction = async (req, res) => {
    try {
        const transaction = await StockTransactionInfo.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Stock transaction not found" });
        }
        await transaction.update({ is_deleted: true });
        res.status(200).json({ message: "Stock transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting stock transaction", error });
    }
};
