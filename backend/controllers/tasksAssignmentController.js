const service = require("../services/tasksAssignmentService");

exports.getAll = async (req, res) => {
    try {
        const data = await service.getTasks();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await service.createTask(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await service.updateTask(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await service.deleteTask(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};