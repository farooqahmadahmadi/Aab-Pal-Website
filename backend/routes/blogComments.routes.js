const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadComment = uploadMiddleware.uploadComment;

const {
  getAll,
  getByBlog,
  create,
  approve,
  remove,
  update,
} = require("../controllers/blogComments.controller");

// ================= ROUTES =================

// GET ALL
router.get("/", getAll);

// GET BY BLOG
router.get("/blog/:blog_id", getByBlog);

// CREATE
router.post("/", uploadComment.single("visitor_photo"), create);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  uploadComment.single("visitor_photo"),
  update
);

// APPROVE
router.put("/approve/:id", authMiddleware, approve);

// DELETE
router.delete("/:id", authMiddleware, remove);

module.exports = router;