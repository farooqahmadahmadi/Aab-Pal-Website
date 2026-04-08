const EmpHiringInfoService = require("../services/empHiringInfoService");

// ===== GET ALL =====
exports.getAllHiring = async (req, res) => {
  try {
    const data = await EmpHiringInfoService.getAll();
    res.json(data);
  } catch (err) {
    console.error("GET ALL ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch hiring info" });
  }
};

// ===== GET BY ID =====
exports.getHiringById = async (req, res) => {
  try {
    const hiring = await EmpHiringInfoService.getById(req.params.id);

    if (!hiring) return res.status(404).json({ message: "Not found" });

    res.json(hiring);
  } catch (err) {
    console.error("GET BY ID ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch hiring info" });
  }
};

// ===== CREATE =====
exports.addHiring = async (req, res) => {
  try {
    const newHiring = await EmpHiringInfoService.create(req.body, req.user);

    res.status(201).json(newHiring);
  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to add hiring info" });
  }
};

// ===== UPDATE =====
exports.updateHiring = async (req, res) => {
  try {
    const hiring = await EmpHiringInfoService.update(
      req.params.id,
      req.body,
      req.user,
    );

    res.json(hiring);
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to update hiring info" });
  }
};

// ===== DELETE =====
exports.deleteHiring = async (req, res) => {
  try {
    await EmpHiringInfoService.delete(req.params.id, req.user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to delete hiring info" });
  }
};
