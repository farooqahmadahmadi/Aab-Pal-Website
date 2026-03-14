/* Access Controls
Admin - Full Access
HR - View Access
Financial - No Access
Project Manager - No Access
Employee - No Access 
Client - No Access
*/

const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentInfoController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), departmentController.getAllDepartments);
router.get("/:id", role("Admin", "HR"), departmentController.getDepartmentById);
router.post("/", role("Admin"), departmentController.createDepartment);
router.put("/:id", role("Admin"), departmentController.updateDepartment);
router.delete("/:id", role("Admin"), departmentController.deleteDepartment);

module.exports = router;