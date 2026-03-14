const express = require("express");
const router = express.Router();

const attendanceShiftController = require("../controllers/attendanceShiftController");

const role = require("../middlewares/roleMiddleware");

// GET all shifts → Admin only
router.get(
    "/",
    role("Admin", "HR"),
    attendanceShiftController.getAllShifts
);

// GET shift by ID → Admin only
router.get(
    "/:id",
    role("Admin"),
    attendanceShiftController.getShiftById
);

// CREATE shift → Admin only
router.post(
    "/",
    role("Admin"),
    attendanceShiftController.createShift
);

// UPDATE shift → Admin + HR
router.put(
    "/:id",
    role("Admin", "HR"),
    attendanceShiftController.updateShift
);

// DELETE shift → Admin only
router.delete(
    "/:id",
    role("Admin"),
    attendanceShiftController.deleteShift
);

module.exports = router;