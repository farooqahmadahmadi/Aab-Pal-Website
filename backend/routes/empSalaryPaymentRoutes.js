/* Access Controls
Admin - Full Access
HR - No Access
Financial - Full Access
Project Manager - No Access
Employee - View Access (only their own payment records)
Client - No Access
*/

const express = require("express");
const router = express.Router();

const empSalaryPaymentController = require("../controllers/empSalaryPaymentController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Financial"), empSalaryPaymentController.getAllPayments);
router.get("/:id", role("Admin", "Financial", "Employee"), empSalaryPaymentController.getPaymentById);
router.post("/", role("Admin", "Financial"), empSalaryPaymentController.createPayment);
router.put("/:id", role("Admin", "Financial"), empSalaryPaymentController.updatePayment);
router.delete("/:id", role("Admin", "Financial"), empSalaryPaymentController.deletePayment);

module.exports = router;