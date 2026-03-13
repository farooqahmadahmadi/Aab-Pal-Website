const express = require("express");
const router = express.Router();

const siteDailyReportsController = require("../controllers/siteDailyReportsController");

router.get("/", siteDailyReportsController.getAllReports);
router.get("/:id", siteDailyReportsController.getReportById);
router.post("/", siteDailyReportsController.createReport);
router.put("/:id", siteDailyReportsController.updateReport);
router.delete("/:id", siteDailyReportsController.deleteReport);

module.exports = router;