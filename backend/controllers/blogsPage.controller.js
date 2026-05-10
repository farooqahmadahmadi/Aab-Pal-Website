const fs = require("fs");
const path = require("path");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../services/blogsPage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await getAll();
    res.json({ data });
  } catch {
    res.status(500).json({ message: "Failed to fetch blogs" });
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
      data.blog_image = `/uploads/blogs_page/${req.file.filename}`;
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
      // DELETE OLD IMAGE
      if (existing?.blog_image) {
        const oldPath = path.join(__dirname, "..", existing.blog_image);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      data.blog_image = `/uploads/blogs_page/${req.file.filename}`;
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

    if (existing?.blog_image) {
      const imgPath = path.join(__dirname, "..", existing.blog_image);

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


// ================= LIKE BLOG =================
exports.likeBlog = async (req, res) => {
  try {
    const blog = await getOne(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await blog.update({
      blog_likes: (blog.blog_likes || 0) + 1,
    });

    res.json({
      success: true,
      likes: blog.blog_likes,
    });
  } catch {
    res.status(500).json({
      message: "Failed to like blog",
    });
  }
};

// ================= SHARE BLOG =================
exports.shareBlog = async (req, res) => {
  try {
    const blog = await getOne(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await blog.update({
      blog_shares: (blog.blog_shares || 0) + 1,
    });

    res.json({
      success: true,
      shares: blog.blog_shares,
    });
  } catch {
    res.status(500).json({
      message: "Failed to share blog",
    });
  }
};

// ================= VIEW BLOG =================
exports.viewBlog = async (req, res) => {
  try {
    const blog = await getOne(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await blog.update({
      blog_views: (blog.blog_views || 0) + 1,
    });

    res.json({
      success: true,
      views: blog.blog_views,
    });
  } catch {
    res.status(500).json({
      message: "Failed to update views",
    });
  }
};