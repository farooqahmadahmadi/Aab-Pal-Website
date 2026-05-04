const fs = require("fs");
const path = require("path");

const {
  getAll,
  getByBlog,
  create,
  approve,
  remove,
} = require("../services/blogComments.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// ================= GET BY BLOG =================
exports.getByBlog = async (req, res) => {
  try {
    const data = await getByBlog(req.params.blog_id);
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 IP tracking
    data.visitor_ip = req.ip;

    // 🔥 IMAGE UPLOAD
    if (req.file) {
      data.visitor_photo = `/uploads/blog_comments/${req.file.filename}`;
    }

    const result = await create(data);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= APPROVE =================
exports.approve = async (req, res) => {
  try {
    const result = await approve(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const existing = await getAll();

    const item = existing.find((c) => c.comment_id == req.params.id);

    // 🔥 delete image
    if (item?.visitor_photo) {
      const imgPath = path.join(__dirname, "..", item.visitor_photo);

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
