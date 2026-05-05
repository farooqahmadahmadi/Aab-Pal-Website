const service = require("../services/testimonialsPage.service");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ONE
exports.getOne = async (req, res) => {
  try {
    const data = await service.getOne(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const data = await service.create(req.body, req.file);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    await service.update(req.params.id, req.body, req.file);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
