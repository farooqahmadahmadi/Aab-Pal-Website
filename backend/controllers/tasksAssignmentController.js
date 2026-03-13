const TasksAssignmentInfo = require("../models/TasksAssignmentInfo");

// GET all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await TasksAssignmentInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};

// GET task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await TasksAssignmentInfo.findByPk(req.params.id);
        if (!task || task.is_deleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error fetching task", error });
    }
};

// CREATE task
exports.createTask = async (req, res) => {
    try {
        const task = await TasksAssignmentInfo.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
};

// UPDATE task
exports.updateTask = async (req, res) => {
    try {
        const task = await TasksAssignmentInfo.findByPk(req.params.id);
        if (!task || task.is_deleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.update(req.body);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
};

// DELETE task (soft delete)
exports.deleteTask = async (req, res) => {
    try {
        const task = await TasksAssignmentInfo.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.update({ is_deleted: true });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
};
