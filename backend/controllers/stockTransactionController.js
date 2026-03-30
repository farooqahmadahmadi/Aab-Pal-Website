const service = require("../services/stockTransactionService");

exports.getAll = async (req, res) => {
    try {
        const data = await service.getTransactions();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const txn = await service.createTransaction(req.body);
        res.status(201).json(txn);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const txn = await service.updateTransaction(req.params.id, req.body);
        res.json(txn);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await service.deleteTransaction(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
