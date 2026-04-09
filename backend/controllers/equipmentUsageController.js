const service = require("../services/equipmentUsageService");

// ===== GET =====
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    console.error("GET EQUIPMENT USAGE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.create(req.body, user);

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE EQUIPMENT USAGE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.update(req.params.id, req.body, user);

    res.json(item);
  } catch (err) {
    console.error("UPDATE EQUIPMENT USAGE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.remove(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE EQUIPMENT USAGE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};
