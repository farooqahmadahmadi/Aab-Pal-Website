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
} = require("../controllers/blogComments.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/blog/:blog_id", getByBlog);

router.post("/", uploadComment.single("visitor_photo"), create);

router.put("/approve/:id", authMiddleware, approve);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
