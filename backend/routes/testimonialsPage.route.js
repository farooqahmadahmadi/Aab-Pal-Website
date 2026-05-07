const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// 🔥 upload instance
const uploadTestimonials = uploadMiddleware.uploadTestimonials;

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  createPublicTestimonial
} = require("../controllers/testimonialsPage.controller");


// ================= PUBLIC ROUTES =================
router.post(
  "/addpublictestimonial",
  uploadTestimonials.single("testimonial_photo"),
  createPublicTestimonial
);
  
// ROUTES
router.get("/", getAll);
router.get("/:id", getOne);

router.post(
  "/",
  authMiddleware,
  uploadTestimonials.single("testimonial_photo"),
  create,
);

router.put(
  "/:id",
  authMiddleware,
  uploadTestimonials.single("testimonial_photo"),
  update,
);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
