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

const paymentsController = require("../controllers/paymentsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Financial"), paymentsController.getAllPayments);
router.get("/:id", role("Admin", "Financial"), paymentsController.getPaymentById);
router.post("/", role("Admin", "Financial"), paymentsController.createPayment);
router.put("/:id", role("Admin", "Financial"), paymentsController.updatePayment);
router.delete("/:id", role("Admin", "Financial"), paymentsController.deletePayment);

module.exports = router;