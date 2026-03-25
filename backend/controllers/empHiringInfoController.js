const EmpHiringInfo = require("../models/EmpHiringInfo");

// ===== GET ALL =====
exports.getAllHiring = async (req, res) => {
    try {
        const data = await EmpHiringInfo.findAll({ where: { is_deleted: false } });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch hiring info" });
    }
};

// ===== GET SINGLE =====
exports.getHiringById = async (req, res) => {
    try {
        const hiring = await EmpHiringInfo.findByPk(req.params.id);
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
        const newHiring = await EmpHiringInfo.create(req.body);
        res.status(201).json(newHiring);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add hiring info" });
    }
};

// ===== UPDATE =====
exports.updateHiring = async (req, res) => {
    try {
        const hiring = await EmpHiringInfo.findByPk(req.params.id);
        if (!hiring) return res.status(404).json({ message: "Not found" });

        await hiring.update(req.body);
        res.json(hiring);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update hiring info" });
    }
};

// ===== DELETE (SOFT) =====
exports.deleteHiring = async (req, res) => {
    try {
        const hiring = await EmpHiringInfo.findByPk(req.params.id);
        if (!hiring) return res.status(404).json({ message: "Not found" });

        await hiring.update({ is_deleted: true });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete hiring info" });
    }
};
