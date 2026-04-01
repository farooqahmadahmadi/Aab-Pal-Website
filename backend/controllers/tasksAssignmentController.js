const service = require("../services/tasksAssignmentService");

exports.getAll = async (req, res) => {
    try {
        const data = await service.getTasks(req.query);
        res.json(data);
    } catch (err) {
        console.error("GET tasks error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await service.createTask(req.body);
        res.status(201).json(data);
    } catch (err) {
        console.error("POST task error:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await service.updateTask(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        console.error("PUT task error:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await service.deleteTask(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("DELETE task error:", err);
        res.status(400).json({ message: err.message });
    }
};
