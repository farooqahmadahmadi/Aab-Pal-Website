const router = require("express").Router();
const ctrl = require("../controllers/employeeAttendanceController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// GET all (for admin/list)
router.get("/", authMiddleware, ctrl.getAllAttendance);

// GET today's attendance for logged-in user
router.get("/me", authMiddleware, ctrl.getTodayAttendance);

// CHECK IN / OUT
router.post("/check-in", authMiddleware, ctrl.checkIn);
router.post("/check-out", authMiddleware, ctrl.checkOut);

// MANUAL
router.post("/manual", authMiddleware, ctrl.createManual);

// UPDATE / DELETE
router.put("/:id", authMiddleware, ctrl.updateAttendance);
router.delete("/:id", authMiddleware, ctrl.deleteAttendance);

module.exports = router;