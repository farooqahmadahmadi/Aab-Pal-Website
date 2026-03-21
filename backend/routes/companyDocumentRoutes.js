const express = require("express");
const router = express.Router();
const { uploadDoc } = require("../middlewares/uploadMiddleware");
const {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} = require("../controllers/companyDocumentController");

// Routes
router.get("/", getDocuments);
router.post("/", uploadDoc.single("file"), createDocument);
router.put("/:id", uploadDoc.single("file"), updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;