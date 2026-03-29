const service = require("../services/materialsService");

// GET
exports.getAll = async (req, res) => {
    try {
        const data = await service.getMaterials();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        const item = await service.createMaterial(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const item = await service.updateMaterial(req.params.id, req.body);
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await service.deleteMaterial(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
