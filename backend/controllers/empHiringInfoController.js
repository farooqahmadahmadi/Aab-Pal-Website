const EmpHiringInfoService = require("../services/empHiringInfoService");

// ===== GET ALL =====
exports.getAll = async (req, res) => {
  try {
    const data = await EmpHiringInfoService.getAll();
    res.json(data);
  } catch (err) {
    console.error("GET ALL HIRING INFO ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch hiring info" });
  }
};

// ===== GET BY ID =====
exports.getById = async (req, res) => {
  try {
    const record = await EmpHiringInfoService.getById(req.params.id);

    if (!record)
      return res.status(404).json({ message: "Hiring info not found" });

    res.json(record);
  } catch (err) {
    console.error("GET HIRING BY ID ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch hiring info" });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user || {};
    const record = await EmpHiringInfoService.create(req.body, user);

    res.status(201).json(record);
  } catch (err) {
    console.error("CREATE HIRING INFO ERROR:", err.message);
    res.status(400).json({
      message: "Failed to create hiring info",
      error: err.message,
    });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user || {};
    const record = await EmpHiringInfoService.update(req.params.id, req.body, user);

    res.json(record);
  } catch (err) {
    console.error("UPDATE HIRING INFO ERROR:", err.message);
    res.status(400).json({
      message: "Failed to update hiring info",
      error: err.message,
    });
  }
};

// ===== DELETE =====
exports.delete = async (req, res) => {
  try {
    const user = req.user || {};
    await EmpHiringInfoService.delete(req.params.id, user);

    res.json({ message: "Hiring info deleted successfully" });
  } catch (err) {
    console.error("DELETE HIRING INFO ERROR:", err.message);
    res.status(400).json({
      message: "Failed to delete hiring info",
      error: err.message,
    });
  }
};