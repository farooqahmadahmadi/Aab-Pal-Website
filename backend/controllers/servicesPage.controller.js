const fs = require("fs");
const path = require("path");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  addRating, // ⭐ NEW
} = require("../services/servicesPage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {
  try {
    const data = await getOne(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ data });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.service_image = `/uploads/services_page/${req.file.filename}`;
    }

    const result = await create(data);

    res.status(201).json({ data: result });
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
      if (existing?.service_image) {
        const oldPath = path.join(__dirname, "..", existing.service_image);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      data.service_image = `/uploads/services_page/${req.file.filename}`;
    }

    const result = await update(req.params.id, data);

    res.json({ data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const existing = await getOne(req.params.id);

    if (existing?.service_image) {
      const imgPath = path.join(__dirname, "..", existing.service_image);

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

// ⭐ NEW: RATING ENDPOINT
exports.addRating = async (req, res) => {
  try {
    const { rating } = req.body;

    const result = await addRating(req.params.id, rating);

    res.json({ data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};