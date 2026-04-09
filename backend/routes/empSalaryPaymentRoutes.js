const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/empSalaryPaymentController");

//  IMPORTANT: specific route must come FIRST
router.get("/activeSalaryInfos", controller.getActiveSalaryInfos);

// CRUD routes
router.get("/", authMiddleware, controller.getAllPayments);
router.get("/:id", authMiddleware, controller.getPaymentById);
router.post("/", authMiddleware, controller.createPayment);
router.put("/:id", authMiddleware, controller.updatePayment);
router.delete("/:id", authMiddleware, controller.deletePayment);

module.exports = router;
