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

const systemLogsController = require("../controllers/systemLogsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), systemLogsController.getAllLogs);
router.get("/:id", role("Admin"), systemLogsController.getLogById);
router.post("/", role("Admin"), systemLogsController.createLog);
//router.put("/:id", role("Admin"), systemLogsController.updateLog);
router.delete("/:id", role("Admin"), systemLogsController.deleteLog);

module.exports = router;