const service = require("../services/cashTransactionsService");

// GET
exports.getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        const data = await service.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const data = await service.update(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await service.remove(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};