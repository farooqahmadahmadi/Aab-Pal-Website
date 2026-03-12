const express = require("express");
const router = express.Router();

const attendanceShiftController = require("../controllers/attendanceShiftController");

router.get("/", attendanceShiftController.getAllShifts);
router.get("/:id", attendanceShiftController.getShiftById);
router.post("/", attendanceShiftController.createShift);
router.put("/:id", attendanceShiftController.updateShift);
router.delete("/:id", attendanceShiftController.deleteShift);

module.exports = router;