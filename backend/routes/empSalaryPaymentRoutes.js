const express = require("express");
const router = express.Router();
const controller = require("../controllers/empSalaryPaymentController");

// ✅ IMPORTANT: specific route must come FIRST
router.get("/activeSalaryInfos", controller.getActiveSalaryInfos);

// CRUD routes
router.get("/", controller.getAllPayments);
router.get("/:id", controller.getPaymentById);
router.post("/", controller.createPayment);
router.put("/:id", controller.updatePayment);
router.delete("/:id", controller.deletePayment);

module.exports = router;