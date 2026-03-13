const express = require("express");
const router = express.Router();

const systemLogsController = require("../controllers/systemLogsController");

router.get("/", systemLogsController.getAllLogs);
router.get("/:id", systemLogsController.getLogById);
router.post("/", systemLogsController.createLog);
router.put("/:id", systemLogsController.updateLog);
router.delete("/:id", systemLogsController.deleteLog);

module.exports = router;