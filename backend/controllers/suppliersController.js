const service = require("../services/suppliersService");

// ===== GET =====
exports.getAll = async (req, res) => {
  try {
    const data = await service.getSuppliers();
    res.json(data);
  } catch (err) {
    console.error("GET SUPPLIERS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.createSupplier(req.body, user);

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE SUPPLIER ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const item = await service.updateSupplier(req.params.id, req.body, user);

    res.json(item);
  } catch (err) {
    console.error("UPDATE SUPPLIER ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteSupplier(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE SUPPLIER ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};