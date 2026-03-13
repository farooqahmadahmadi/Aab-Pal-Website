const express = require("express");
const router = express.Router();

const stockTransactionsController = require("../controllers/stockTransactionsController");

router.get("/", stockTransactionsController.getAllStockTransactions);
router.get("/:id", stockTransactionsController.getStockTransactionById);
router.post("/", stockTransactionsController.createStockTransaction);
router.put("/:id", stockTransactionsController.updateStockTransaction);
router.delete("/:id", stockTransactionsController.deleteStockTransaction);

module.exports = router;