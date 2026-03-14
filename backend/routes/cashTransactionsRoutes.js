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

const cashTransactionsController = require("../controllers/cashTransactionsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Financial"), cashTransactionsController.getAllTransactions);
router.get("/:id", role("Admin", "Financial"), cashTransactionsController.getTransactionById);
router.post("/", role("Admin", "Financial"), cashTransactionsController.createTransaction);
router.put("/:id", role("Admin", "Financial"), cashTransactionsController.updateTransaction);
router.delete("/:id", role("Admin", "Financial"), cashTransactionsController.deleteTransaction);

module.exports = router;