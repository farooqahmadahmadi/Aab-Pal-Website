const service = require("../services/contractMilestoneService");

// GET
exports.getAll = async (req, res) => {
  try {
    const data = await service.getMilestones();
    res.json(data);
  } catch (err) {
    console.error("GET MILESTONE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.createMilestone(req.body, user);

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE MILESTONE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.updateMilestone(
      req.params.id,
      req.body,
      user
    );

    res.json(item);
  } catch (err) {
    console.error("UPDATE MILESTONE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteMilestone(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE MILESTONE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};