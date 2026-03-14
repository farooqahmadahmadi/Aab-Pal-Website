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

const stockTransactionsController = require("../controllers/stockTransactionsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), stockTransactionsController.getAllStockTransactions);
router.get("/:id", role("Admin"), stockTransactionsController.getStockTransactionById);
router.post("/", role("Admin"), stockTransactionsController.createStockTransaction);
router.put("/:id", role("Admin"), stockTransactionsController.updateStockTransaction);
router.delete("/:id", role("Admin"), stockTransactionsController.deleteStockTransaction);

module.exports = router;