const SystemLogs = require("../models/SystemLogs");

// GET all logs
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await SystemLogs.findAll({
            order: [["created_at", "DESC"]]
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching logs", error });
    }
};

// GET log by ID
exports.getLogById = async (req, res) => {
    try {
        const log = await SystemLogs.findByPk(req.params.id);
        if (!log) {
            return res.status(404).json({ message: "Log not found" });
        }
        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: "Error fetching log", error });
    }
};


// CREATE log (manual use only)
exports.createLog = async (req, res) => {
    try {
        const log = await SystemLogs.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: "Error creating log", error });
    }
};


// DELETE log (Admin only)
exports.deleteLog = async (req, res) => {
    try {
        const log = await SystemLogs.findByPk(req.params.id);
        if (!log) {
            return res.status(404).json({ message: "Log not found" });
        }
        await log.destroy();
        res.status(200).json({ message: "Log deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting log", error });
    }
};
