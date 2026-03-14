/* Access Controls
Admin - Full Access
HR - No Access
Financial - Full Access
Project Manager - No Access
Employee - No Access
Client - No Access
*/

const express = require("express");
const router = express.Router();

const invoicesController = require("../controllers/invoicesController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Financial"), invoicesController.getAllInvoices);
router.get("/:id", role("Admin", "Financial"), invoicesController.getInvoiceById);
router.post("/", role("Admin", "Financial"), invoicesController.createInvoice);
router.put("/:id", role("Admin", "Financial"), invoicesController.updateInvoice);
router.delete("/:id", role("Admin", "Financial"), invoicesController.deleteInvoice);

module.exports = router;