const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadProject = uploadMiddleware.uploadProject;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/ourProjectsPage.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

router.post("/", authMiddleware, uploadProject.single("project_image"), create);

router.put(
  "/:id",
  authMiddleware,
  uploadProject.single("project_image"),
  update,
);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
