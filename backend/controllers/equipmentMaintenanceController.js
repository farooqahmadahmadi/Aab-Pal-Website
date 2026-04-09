const service = require("../services/equipmentMaintenanceService");

// ===== GET =====
exports.getAll = async (req, res) => {
  try {
    const data = await service.getMaintenances();
    res.json(data);
  } catch (err) {
    console.error("GET MAINTENANCE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.createMaintenance(req.body, user);

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE MAINTENANCE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.updateMaintenance(req.params.id, req.body, user);

    res.json(item);
  } catch (err) {
    console.error("UPDATE MAINTENANCE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteMaintenance(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE MAINTENANCE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};
