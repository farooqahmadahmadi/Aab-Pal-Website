/* Access Controls
Admin - Full Access
HR - View and Edit Access
Financial - No Access
Project Manager - No Access
Employee - No Access 
Client - No Access
*/

const express = require("express");
const router = express.Router();

const attendanceShiftController = require("../controllers/attendanceShiftController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), attendanceShiftController.getAllShifts);
router.get("/:id", role("Admin"), attendanceShiftController.getShiftById);
router.post("/", role("Admin"), attendanceShiftController.createShift);
router.put("/:id", role("Admin", "HR"), attendanceShiftController.updateShift);
router.delete("/:id", role("Admin"), attendanceShiftController.deleteShift);

module.exports = router;