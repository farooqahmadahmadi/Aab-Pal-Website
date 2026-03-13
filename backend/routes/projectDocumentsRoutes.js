const express = require("express");
const router = express.Router();

const projectDocumentsController = require("../controllers/projectDocumentsController");

router.get("/", projectDocumentsController.getAllDocuments);
router.get("/:id", projectDocumentsController.getDocumentById);
router.post("/", projectDocumentsController.createDocument);
router.put("/:id", projectDocumentsController.updateDocument);
router.delete("/:id", projectDocumentsController.deleteDocument);

module.exports = router;