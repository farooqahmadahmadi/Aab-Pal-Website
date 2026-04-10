const Tasks = require("../models/TasksAssignmentInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// GET ALL
exports.getTasks = async () => {
  return await Tasks.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.createTask = async (data, user = {}) => {
  const task = await Tasks.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "tasks_assignment_info",
    reference_record_id: task.task_assignment_id,
    old_value: null,
    new_value: task.toJSON(),
  });

  return task;
};

// UPDATE
exports.updateTask = async (id, data, user = {}) => {
  const task = await Tasks.findOne({
    where: { task_assignment_id: id, is_deleted: false },
  });

  if (!task) throw new Error("Task not found");

  const oldValue = task.toJSON();

  await task.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "tasks_assignment_info",
    reference_record_id: task.task_assignment_id,
    old_value: oldValue,
    new_value: task.toJSON(),
  });

  return task;
};

// DELETE (soft/hard via helper)
exports.deleteTask = async (id, user = {}) => {
  const task = await Tasks.findOne({
    where: { task_assignment_id: id, is_deleted: false },
  });

  if (!task) throw new Error("Task not found");

  await handleDelete(task, user, "tasks_assignment_info", getUserId(user));

  return true;
};
