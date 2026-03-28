const express = require("express");
const router = express.Router();
const { uploadProjectDoc } = require("../middlewares/uploadMiddleware");
const {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} = require("../controllers/projectDocumentController");

router.get("/", getDocuments);
router.post("/", uploadProjectDoc.single("file"), createDocument);
router.put("/:id", uploadProjectDoc.single("file"), updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
