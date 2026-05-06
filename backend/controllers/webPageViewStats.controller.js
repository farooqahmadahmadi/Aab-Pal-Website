const {
  getAll,
  getOne,
  getByPage,
  create,
  update,
  remove,
} = require("../services/webPageViewStats.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {
  try {
    const data = await getOne(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(data);
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ================= GET BY PAGE =================
exports.getByPage = async (req, res) => {
  try {
    const data = await getByPage(req.params.pageId);
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const data = await create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const data = await update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
