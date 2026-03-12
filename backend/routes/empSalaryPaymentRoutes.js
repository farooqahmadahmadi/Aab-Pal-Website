const express = require("express");
const router = express.Router();

const empSalaryPaymentController = require("../controllers/empSalaryPaymentController");

router.get("/", empSalaryPaymentController.getAllPayments);
router.get("/:id", empSalaryPaymentController.getPaymentById);
router.post("/", empSalaryPaymentController.createPayment);
router.put("/:id", empSalaryPaymentController.updatePayment);
router.delete("/:id", empSalaryPaymentController.deletePayment);

module.exports = router;