const express = require("express");
const router = express.Router();

const empAttendSummaryController = require("../controllers/empAttendSummaryController");

router.get("/", empAttendSummaryController.getAllSummaries);
router.get("/:id", empAttendSummaryController.getSummaryById);
router.post("/", empAttendSummaryController.createSummary);
router.put("/:id", empAttendSummaryController.updateSummary);
router.delete("/:id", empAttendSummaryController.deleteSummary);

module.exports = router;