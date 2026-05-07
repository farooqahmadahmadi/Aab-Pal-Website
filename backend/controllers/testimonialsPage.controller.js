const fs = require("fs");
const path = require("path");
const service = require("../services/testimonialsPage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {
  try {
    const data = await service.getOne(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ data });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ================= CREATE (ADMIN) =================
exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body, req.file);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= PUBLIC CREATE (NO AUTH) =================
exports.createPublicTestimonial = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 default for public users
    data.is_approved = false;

    const result = await service.create(data, req.file);

    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const existing = await service.getOne(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Not found" });
    }

    const data = req.body;

    if (req.file) {
      if (existing.testimonial_photo) {
        const oldPath = path.join(
          __dirname,
          "..",
          existing.testimonial_photo
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      data.testimonial_photo = `/uploads/testimonials_page/${req.file.filename}`;
    }

    const result = await service.update(req.params.id, data, req.file);

    res.json({ data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const existing = await service.getOne(req.params.id);

    if (existing?.testimonial_photo) {
      const imgPath = path.join(
        __dirname,
        "..",
        existing.testimonial_photo
      );

      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await service.remove(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};