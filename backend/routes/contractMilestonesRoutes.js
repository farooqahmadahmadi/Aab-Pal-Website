const express = require("express");
const router = express.Router();

const contractMilestonesController = require("../controllers/contractMilestonesController");

router.get("/", contractMilestonesController.getAllMilestones);
router.get("/:id", contractMilestonesController.getMilestoneById);
router.post("/", contractMilestonesController.createMilestone);
router.put("/:id", contractMilestonesController.updateMilestone);
router.delete("/:id", contractMilestonesController.deleteMilestone);

module.exports = router;