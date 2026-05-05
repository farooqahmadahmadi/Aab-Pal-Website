const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// 👇 new upload config
const uploadServices = uploadMiddleware.uploadServices;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/servicesPage.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

router.post(
  "/",
  authMiddleware,
  uploadServices.single("service_image"),
  create,
);

router.put(
  "/:id",
  authMiddleware,
  uploadServices.single("service_image"),
  update,
);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
