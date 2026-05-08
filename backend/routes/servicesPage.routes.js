const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadServices = uploadMiddleware.uploadServices;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  addRating, // ⭐ NEW
} = require("../controllers/servicesPage.controller");

// ================= PUBLIC ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

// ================= CREATE =================
router.post(
  "/",
  authMiddleware,
  uploadServices.single("service_image"),
  create,
);

// ================= UPDATE =================
router.put(
  "/:id",
  authMiddleware,
  uploadServices.single("service_image"),
  update,
);

// ================= DELETE =================
router.delete("/:id", authMiddleware, remove);

// ================= ⭐ NEW: RATING ROUTE =================
// user can rate service
router.patch("/:id/rating", addRating);

module.exports = router;
