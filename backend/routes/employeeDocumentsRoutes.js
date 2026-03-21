const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/uploadMiddleware");

const {
    listDocuments,
    getDocument,
    createDocument,
    editDocument,
    softDelete,
    restore,
    hardDelete
} = require("../controllers/employeeDocumentsController");

// ===== ROUTES =====
router.get("/", listDocuments);
router.get("/:id", getDocument);
router.post("/", upload.single("file"), createDocument);
router.put("/:id", upload.single("file"), editDocument);

router.post("/soft-delete/:id", softDelete);
router.post("/restore/:id", restore);

router.delete("/:id", hardDelete);

module.exports = router;



