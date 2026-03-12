const express = require("express");
const router = express.Router();

const empAttendanceController = require("../controllers/empAttendanceController");

router.get("/", empAttendanceController.getAllAttendance);
router.get("/:id", empAttendanceController.getAttendanceById);
router.post("/", empAttendanceController.createAttendance);
router.put("/:id", empAttendanceController.updateAttendance);
router.delete("/:id", empAttendanceController.deleteAttendance);

module.exports = router;