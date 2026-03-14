/* Access Controls
Admin - Full Access
HR - Full Access
Financial - View Access (Only salary info, no access to employee personal info)
Project Manager - No Access
Employee - View Access (Only their own record)
Client - No Access
const role = require("../middlewares/roleMiddleware");
*/

const express = require("express");
const router = express.Router();

const empSalaryController = require("../controllers/empSalaryController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR", "Financial"), empSalaryController.getAllSalaries);
router.get("/:id", role("Admin", "HR", "Financial", "Employee"), empSalaryController.getSalaryById);
router.post("/", role("Admin", "HR"), empSalaryController.createSalary);
router.put("/:id", role("Admin", "HR"), empSalaryController.updateSalary);
router.delete("/:id", role("Admin", "HR"), empSalaryController.deleteSalary);

module.exports = router;