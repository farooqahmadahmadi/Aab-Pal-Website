const service = require("../services/websiteLanguage.service");

// GET all
const getAll = async (req, res) => {
  try {
    const data = await service.getAllLanguages();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
const getById = async (req, res) => {
  try {
    const data = await service.getLanguageById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
const create = async (req, res) => {
  try {
    const data = await service.createLanguage(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    const data = await service.updateLanguage(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const remove = async (req, res) => {
  try {
    const data = await service.deleteLanguage(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
