/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - No Access
Employee - No Access 
Client - No Access
*/

const express = require("express");
const router = express.Router();

const documentController = require("../controllers/companyDocumentController");
const role = require("../middlewares/roleMiddleware");

// GET all documents
router.get(
    "/",
    role("Admin"),
    documentController.getAllDocuments
);

// GET document by ID
router.get(
    "/:id",
    role("Admin"),
    documentController.getDocumentById
);

// CREATE document
router.post(
    "/",
    role("Admin"),
    documentController.createDocument
);

// UPDATE document
router.put(
    "/:id",
    role("Admin"),
    documentController.updateDocument
);

// DELETE document
router.delete(
    "/:id",
    role("Admin"),
    documentController.deleteDocument
);

module.exports = router;