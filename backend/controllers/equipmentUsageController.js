const EquipmentUsageInfo = require("../models/EquipmentUsageInfo");

// GET all equipment usage
exports.getAllUsage = async (req, res) => {
    try {
        const usage = await EquipmentUsageInfo.findAll();
        res.status(200).json(usage);
    } catch (error) {
        res.status(500).json({ message: "Error fetching equipment usage", error });
    }
};

// GET usage by ID
exports.getUsageById = async (req, res) => {
    try {
        const usage = await EquipmentUsageInfo.findByPk(req.params.id);
        if (!usage) {
            return res.status(404).json({ message: "Usage record not found" });
        }
        res.status(200).json(usage);
    } catch (error) {
        res.status(500).json({ message: "Error fetching usage record", error });
    }
};

// CREATE usage
exports.createUsage = async (req, res) => {
    try {
        const usage = await EquipmentUsageInfo.create(req.body);
        res.status(201).json(usage);
    } catch (error) {
        res.status(500).json({ message: "Error creating usage record", error });
    }
};

// UPDATE usage
exports.updateUsage = async (req, res) => {
    try {
        const usage = await EquipmentUsageInfo.findByPk(req.params.id);
        if (!usage) {
            return res.status(404).json({ message: "Usage record not found" });
        }
        await usage.update(req.body);
        res.status(200).json(usage);
    } catch (error) {
        res.status(500).json({ message: "Error updating usage record", error });
    }
};

// DELETE usage
exports.deleteUsage = async (req, res) => {
    try {
        const usage = await EquipmentUsageInfo.findByPk(req.params.id);
        if (!usage) {
            return res.status(404).json({ message: "Usage record not found" });
        }
        await usage.destroy();
        res.status(200).json({ message: "Usage record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting usage record", error });
    }
};
