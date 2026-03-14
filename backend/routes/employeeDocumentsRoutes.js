/* Access Controls
Admin - Full Access
HR - Full Access
Financial - No Access
Project Manager - No Access
Employee - View Self Access
Client - No Access
const role = require("../middlewares/roleMiddleware");
*/

const express = require("express");
const router = express.Router();

const employeeDocumentsController = require("../controllers/employeeDocumentsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), employeeDocumentsController.getAllDocuments);
router.get("/:id", role("Admin", "HR", "Employee"), employeeDocumentsController.getDocumentById);
router.post("/", role("Admin", "HR"), employeeDocumentsController.createDocument);
router.put("/:id", role("Admin", "HR"), employeeDocumentsController.updateDocument);
router.delete("/:id", role("Admin", "HR"), employeeDocumentsController.deleteDocument);

module.exports = router;