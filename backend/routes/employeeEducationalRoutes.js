/* Access Controls
Admin - Full Access
HR - Full Access
Financial - No Access
Project Manager - No Access
Employee - View Access (Only their own records)
Client - No Access
const role = require("../middlewares/roleMiddleware");
*/

const express = require("express");
const router = express.Router();

const employeeEducationalController = require("../controllers/employeeEducationalController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), employeeEducationalController.getAllEducation);
router.get("/:id", role("Admin", "HR", "Employee"), employeeEducationalController.getEducationById);
router.post("/", role("Admin", "HR"), employeeEducationalController.createEducation);
router.put("/:id", role("Admin", "HR"), employeeEducationalController.updateEducation);
router.delete("/:id", role("Admin", "HR"), employeeEducationalController.deleteEducation);

module.exports = router;