const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadBlogImages = uploadMiddleware.uploadBlogImages;

const {
  getAll,
  getByBlog,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/blogImages.controller");

// ================= ROUTES =================

// GET ALL
router.get("/", getAll);

// GET BY BLOG
router.get("/blog/:blog_id", getByBlog);

// GET ONE
router.get("/:id", getOne);

// CREATE
router.post("/", authMiddleware, uploadBlogImages.single("image_path"), create);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  uploadBlogImages.single("image_path"),
  update,
);

// DELETE
router.delete("/:id", authMiddleware, remove);

module.exports = router;
