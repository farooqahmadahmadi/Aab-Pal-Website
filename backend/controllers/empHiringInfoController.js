const EmpHiringInfoService = require("../services/empHiringInfoService");

// ===== GET ALL =====
exports.getAllHiring = async (req, res) => {
    try {
        const data = await EmpHiringInfoService.getAll();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch hiring info" });
    }
};

// ===== GET SINGLE =====
exports.getHiringById = async (req, res) => {
    try {
        const hiring = await EmpHiringInfoService.getById(req.params.id);
        if (!hiring) return res.status(404).json({ message: "Not found" });

        res.json(hiring);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch hiring info" });
    }
};

// ===== CREATE =====
exports.addHiring = async (req, res) => {
    try {
        const newHiring = await EmpHiringInfoService.create(req.body);
        res.status(201).json(newHiring);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add hiring info" });
    }
};

// ===== UPDATE =====
exports.updateHiring = async (req, res) => {
    try {
        const hiring = await EmpHiringInfoService.update(req.params.id, req.body);
        if (!hiring) return res.status(404).json({ message: "Not found" });

        res.json(hiring);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update hiring info" });
    }
};

// ===== DELETE =====
exports.deleteHiring = async (req, res) => {
    try {
        const deleted = await EmpHiringInfoService.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete hiring info" });
    }
};