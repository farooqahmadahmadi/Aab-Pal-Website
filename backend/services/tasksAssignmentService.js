const Tasks = require("../models/TasksAssignmentInfo");

// GET ALL
exports.getTasks = async () => {
    return await Tasks.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]],
    });
};

// CREATE
exports.createTask = async (data) => {
    return await Tasks.create(data);
};

// UPDATE
exports.updateTask = async (id, data) => {
    const task = await Tasks.findOne({
        where: { task_assignment_id: id, is_deleted: false }
    });

    if (!task) throw new Error("Task not found");

    await task.update(data);
    return task;
};

// DELETE (soft delete)
exports.deleteTask = async (id) => {
    const task = await Tasks.findOne({
        where: { task_assignment_id: id, is_deleted: false }
    });

    if (!task) throw new Error("Task not found");

    await task.update({ is_deleted: true });
};