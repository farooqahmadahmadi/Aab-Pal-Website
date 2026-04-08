const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { uploadDoc } = require("../middlewares/uploadMiddleware");
const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/companyDocumentController");

// GET all documents
router.get("/", authMiddleware, getDocuments);

// CREATE document
router.post("/", authMiddleware, uploadDoc.single("file"), createDocument);

// UPDATE document
router.put("/:id", authMiddleware, uploadDoc.single("file"), updateDocument);

// ONE DELETE (Auto Soft + Hard)
router.delete("/:id", authMiddleware, deleteDocument);

module.exports = router;  