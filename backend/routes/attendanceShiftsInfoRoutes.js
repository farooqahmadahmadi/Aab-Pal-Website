const express = require("express");
const router = express.Router();
const controller = require("../controllers/attendanceShiftsInfoController");

// CRUD
router.get("/", controller.getShifts);
router.get("/:id", controller.getShift);
router.post("/", controller.createShift);
router.put("/:id", controller.updateShift);
router.delete("/:id", controller.deleteShift);

module.exports = router;
