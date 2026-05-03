const fs = require("fs");
const path = require("path");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../services/homePage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch home page sections" });
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

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.section_image = `/uploads/home_page/${req.file.filename}`;
    }

    const result = await create(data);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const existing = await getOne(req.params.id);
    const data = req.body;

    if (req.file) {
      // 🔥 delete old image
      if (existing?.section_image) {
        const oldPath = path.join(__dirname, "..", existing.section_image);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // 🔥 set new image
      data.section_image = `/uploads/home_page/${req.file.filename}`;
    }

    const result = await update(req.params.id, data);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const existing = await getOne(req.params.id);

    if (existing?.section_image) {
      const imgPath = path.join(__dirname, "..", existing.section_image);

      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await remove(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};