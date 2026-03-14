/* Access Controls
Admin - Full Access
HR - Full Access
Financial - No Access
Project Manager - No Access
Employee - View Access (Only their own record)
Client - No Access
*/

const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeInfoController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), employeeController.getAllEmployees);
router.get("/:id", role("Admin", "HR", "Employee"), employeeController.getEmployeeById);
router.post("/", role("Admin", "HR"), employeeController.createEmployee);
router.put("/:id", role("Admin", "HR"), employeeController.updateEmployee);
router.delete("/:id", role("Admin", "HR"), employeeController.deleteEmployee);

module.exports = router;