const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadBlog = uploadMiddleware.uploadBlog;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  likeBlog,
  shareBlog,
  viewBlog,
} = require("../controllers/blogsPage.controller");

// ================= ROUTES =================
router.get("/", getAll);

router.get("/:id", getOne);

// ================= LIKE / SHARE / VIEW =================
router.patch("/:id/like", likeBlog);

router.patch("/:id/share", shareBlog);

router.patch("/:id/view", viewBlog);

// ================= CRUD =================
router.post(
  "/",
  authMiddleware,
  uploadBlog.single("blog_image"),
  create,
);

router.put(
  "/:id",
  authMiddleware,
  uploadBlog.single("blog_image"),
  update,
);

router.delete("/:id", authMiddleware, remove);

module.exports = router;