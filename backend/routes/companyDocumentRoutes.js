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

router.get("/", role("Admin"), documentController.getAllDocuments);
router.get("/:id", role("Admin"), documentController.getDocumentById);
router.post("/", role("Admin"), documentController.createDocument);
router.put("/:id", role("Admin"), documentController.updateDocument);
router.delete("/:id", role("Admin"), documentController.deleteDocument);

module.exports = router;