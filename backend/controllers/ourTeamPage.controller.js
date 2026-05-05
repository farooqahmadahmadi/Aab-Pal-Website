const fs = require("fs");
const path = require("path");

const service = require("../services/ourTeamPage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {
  try {
    const data = await service.getOne(req.params.id);

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
      data.member_photo = `/uploads/our_team_page/${req.file.filename}`;
    }

    const result = await service.create(data);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const existing = await service.getOne(req.params.id);
    const data = req.body;

    if (req.file) {
      // DELETE OLD IMAGE
      if (existing?.member_photo) {
        const oldPath = path.join(__dirname, "..", existing.member_photo);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      data.member_photo = `/uploads/our_team_page/${req.file.filename}`;
    }

    const result = await service.update(req.params.id, data);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const existing = await service.getOne(req.params.id);

    if (existing?.member_photo) {
      const imgPath = path.join(__dirname, "..", existing.member_photo);

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
