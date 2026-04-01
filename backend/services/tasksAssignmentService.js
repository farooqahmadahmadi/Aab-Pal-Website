const Tasks = require("../models/TasksAssignmentInfo");

// GET (with search + pagination)
exports.getTasks = async (query) => {
    const { page = 1, limit = 10, search = "" } = query;

    const offset = (page - 1) * limit;

    const where = {
        is_deleted: false,
        ...(search && {
            task_title: {
                [require("sequelize").Op.like]: `%${search}%`
            }
        })
    };

    const { rows, count } = await Tasks.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
    });

    return {
        data: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
    };
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

