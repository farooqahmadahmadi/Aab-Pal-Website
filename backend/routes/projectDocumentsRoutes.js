/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - Create, View & Update Access (Only for projects they manage)
Employee - No Access
Client - No Access
*/

const express = require("express");
const router = express.Router();

const projectDocumentsController = require("../controllers/projectDocumentsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Project Manager"), projectDocumentsController.getAllDocuments);
router.get("/:id", role("Admin", "Project Manager"), projectDocumentsController.getDocumentById);
router.post("/", role("Admin", "Project Manager"), projectDocumentsController.createDocument);
router.put("/:id", role("Admin", "Project Manager"), projectDocumentsController.updateDocument);
router.delete("/:id", role("Admin"), projectDocumentsController.deleteDocument);

module.exports = router;