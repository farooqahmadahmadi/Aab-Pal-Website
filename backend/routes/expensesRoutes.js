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

const expensesController = require("../controllers/expensesController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Financial"), expensesController.getAllExpenses);
router.get("/:id", role("Admin", "Financial"), expensesController.getExpenseById);
router.post("/", role("Admin", "Financial"), expensesController.createExpense);
router.put("/:id", role("Admin", "Financial"), expensesController.updateExpense);
router.delete("/:id", role("Admin", "Financial"), expensesController.deleteExpense);

module.exports = router;