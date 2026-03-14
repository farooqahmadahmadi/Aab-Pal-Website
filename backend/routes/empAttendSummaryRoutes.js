/* Access Controls
Admin - Full Access
HR - Full Access
Financial - View Access 
Project Manager - No Access
Employee - View Access (Only their own summary records)
Client - No Access
*/

const express = require("express");
const router = express.Router();

const empAttendSummaryController = require("../controllers/empAttendSummaryController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR", "Financial"), empAttendSummaryController.getAllSummaries);
router.get("/:id", role("Admin", "HR", "Financial", "Employee"), empAttendSummaryController.getSummaryById);
router.post("/", role("Admin", "HR"), empAttendSummaryController.createSummary);
router.put("/:id", role("Admin", "HR"), empAttendSummaryController.updateSummary);
router.delete("/:id", role("Admin", "HR"), empAttendSummaryController.deleteSummary);

module.exports = router;