const express = require("express");
const router = express.Router();

const employeeDocumentsController = require("../controllers/employeeDocumentsController");

router.get("/", employeeDocumentsController.getAllDocuments);
router.get("/:id", employeeDocumentsController.getDocumentById);
router.post("/", employeeDocumentsController.createDocument);
router.put("/:id", employeeDocumentsController.updateDocument);
router.delete("/:id", employeeDocumentsController.deleteDocument);

module.exports = router;