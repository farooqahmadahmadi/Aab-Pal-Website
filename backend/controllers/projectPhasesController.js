const service = require("../services/projectPhasesService");

// ===== GET ALL =====
const getPhases = async (req, res) => {
  try {
    const data = await service.getAllPhases();
    res.json(data);
  } catch (err) {
    console.error("GET PHASES ERROR:", err.message);
    res.status(500).json({ message: "Failed to load project phases" });
  }
};

// ===== GET BY ID =====
const getPhase = async (req, res) => {
  try {
    const data = await service.getPhaseById(req.params.id);

    if (!data) return res.status(404).json({ message: "Phase not found" });

    res.json(data);
  } catch (err) {
    console.error("GET PHASE ERROR:", err.message);
    res.status(500).json({ message: "Failed to load phase" });
  }
};

// ===== CREATE =====
const createPhase = async (req, res) => {
  try {
    const user = req.user;

    const data = await service.addPhase(req.body, user);

    res.status(201).json(data);
  } catch (err) {
    console.error("CREATE PHASE ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to add phase",
    });
  }
};

// ===== UPDATE =====
const updatePhase = async (req, res) => {
  try {
    const user = req.user;

    const data = await service.updatePhase(req.params.id, req.body, user);

    res.json(data);
  } catch (err) {
    console.error("UPDATE PHASE ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to update phase",
    });
  }
};

// ===== DELETE =====
const deletePhaseCtrl = async (req, res) => {
  try {
    const user = req.user;

    await service.deletePhase(req.params.id, user);

    res.json({ message: "Phase deleted successfully" });
  } catch (err) {
    console.error("DELETE PHASE ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to delete phase",
    });
  }
};

module.exports = {
  getPhases,
  getPhase,
  createPhase,
  updatePhase,
  deletePhase: deletePhaseCtrl,
};
