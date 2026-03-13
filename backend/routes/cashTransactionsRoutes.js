const express = require("express");
const router = express.Router();

const cashTransactionsController = require("../controllers/cashTransactionsController");

router.get("/", cashTransactionsController.getAllTransactions);
router.get("/:id", cashTransactionsController.getTransactionById);
router.post("/", cashTransactionsController.createTransaction);
router.put("/:id", cashTransactionsController.updateTransaction);
router.delete("/:id", cashTransactionsController.deleteTransaction);

module.exports = router;