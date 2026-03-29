const service = require("../services/contractService");

// GET
exports.getAll = async (req, res) => {
    try {
        const data = await service.getContracts();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "File required" });

        const data = {
            ...req.body,
            contract_file_url: `/uploads/documents/contracts/${req.file.filename}`
        };

        const item = await service.createContract(data);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const data = { ...req.body };

        if (req.file) {
            data.contract_file_url = `/uploads/documents/contracts/${req.file.filename}`;
        }

        const item = await service.updateContract(req.params.id, data);
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await service.deleteContract(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
