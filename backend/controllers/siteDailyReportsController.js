const service = require("../services/siteDailyReportsService");

// GET
exports.getAll = async (req, res) => {
  try {
    const data = await service.getReports();
    res.json(data);
  } catch (err) {
    console.error("GET REPORT ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const data = await service.createReport(req.body, user);

    res.status(201).json(data);
  } catch (err) {
    console.error("CREATE REPORT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const data = await service.updateReport(req.params.id, req.body, user);

    res.json(data);
  } catch (err) {
    console.error("UPDATE REPORT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteReport(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE REPORT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};
