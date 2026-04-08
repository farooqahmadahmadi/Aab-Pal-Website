const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

const {
  listDocuments,
  getDocument,
  createDocument,
  editDocument,
  deleteDocument,
} = require("../controllers/employeeDocumentsController");

// GET all documents
router.get("/", authMiddleware, listDocuments);

// GET By ID
router.get("/:id", authMiddleware, getDocument);

// CREATE document
router.post("/", authMiddleware, upload.single("file"), createDocument);

// UPDATE document
router.put("/:id", authMiddleware, upload.single("file"), editDocument);

// ONE DELETE (Auto Soft + Hard)
router.delete("/:id", authMiddleware, deleteDocument);

module.exports = router;
