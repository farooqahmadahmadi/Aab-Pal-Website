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

const contractMilestonesController = require("../controllers/contractMilestonesController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), contractMilestonesController.getAllMilestones);
router.get("/:id", role("Admin"), contractMilestonesController.getMilestoneById);
router.post("/", role("Admin"), contractMilestonesController.createMilestone);
router.put("/:id", role("Admin"), contractMilestonesController.updateMilestone);
router.delete("/:id", role("Admin"), contractMilestonesController.deleteMilestone);

module.exports = router;