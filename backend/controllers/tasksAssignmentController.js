const service = require("../services/tasksAssignmentService");

// GET
exports.getAll = async (req, res) => {
  try {
    const data = await service.getTasks();
    res.json(data);
  } catch (err) {
    console.error("GET TASK ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const data = await service.createTask(req.body, user);

    res.status(201).json(data);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const data = await service.updateTask(req.params.id, req.body, user);

    res.json(data);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteTask(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};
