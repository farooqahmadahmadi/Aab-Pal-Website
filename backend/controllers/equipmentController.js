const service = require("../services/equipmentService");

// ===== GET =====
exports.getAll = async (req, res) => {
  try {
    const data = await service.getEquipments();
    res.json(data);
  } catch (err) {
    console.error("GET EQUIPMENT ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.createEquipment(req.body, user);

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE EQUIPMENT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.updateEquipment(
      req.params.id,
      req.body,
      user
    );

    res.json(item);
  } catch (err) {
    console.error("UPDATE EQUIPMENT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteEquipment(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE EQUIPMENT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};