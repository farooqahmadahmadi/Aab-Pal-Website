const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { uploadProjectDoc } = require("../middlewares/uploadMiddleware");

const controller = require("../controllers/projectDocumentController");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getDocuments);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, controller.getDocumentById);

// ===== CREATE =====
router.post(
  "/",
  authMiddleware,
  uploadProjectDoc.single("file"),
  controller.createDocument,
);

// ===== UPDATE =====
router.put(
  "/:id",
  authMiddleware,
  uploadProjectDoc.single("file"),
  controller.updateDocument,
);

// ===== DELETE =====
router.delete("/:id", authMiddleware, controller.deleteDocument);

module.exports = router;
