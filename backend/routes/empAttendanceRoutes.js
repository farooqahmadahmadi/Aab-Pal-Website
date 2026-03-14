/* Access Controls
Admin - Full Access
HR - Full Access
Financial - No Access
Project Manager - No Access
Employee - Create and View Access (Can only create and view their own attendance records)
Client - No Access
*/

const express = require("express");
const router = express.Router();

const empAttendanceController = require("../controllers/empAttendanceController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), empAttendanceController.getAllAttendance);
router.get("/:id", role("Admin", "HR", "Employee"), empAttendanceController.getAttendanceById);
router.post("/", role("Admin", "HR", "Employee"), empAttendanceController.createAttendance);
router.put("/:id", role("Admin", "HR"), empAttendanceController.updateAttendance);
router.delete("/:id", role("Admin", "HR"), empAttendanceController.deleteAttendance);

module.exports = router;