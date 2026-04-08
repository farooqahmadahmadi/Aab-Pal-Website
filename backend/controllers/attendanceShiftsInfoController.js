const attendanceService = require("../services/attendanceShiftsInfoService");

// ===== GET ALL =====
exports.getShifts = async (req, res) => {
  try {
    const shifts = await attendanceService.getAllShifts();
    res.json(shifts);
  } catch (err) {
    console.error("GET SHIFTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch shifts" });
  }
};

// ===== GET BY ID =====
exports.getShift = async (req, res) => {
  try {
    const shift = await attendanceService.getShiftById(req.params.id);
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    res.json(shift);
  } catch (err) {
    console.error("GET SHIFT ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch shift" });
  }
};

// ===== CREATE =====
exports.createShift = async (req, res) => {
  try {
    const shift = await attendanceService.createShift(req.body, req.user);
    res.status(201).json(shift);
  } catch (err) {
    console.error("CREATE SHIFT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to create shift",
    });
  }
};

// ===== UPDATE =====
exports.updateShift = async (req, res) => {
  try {
    const shift = await attendanceService.updateShift(
      req.params.id,
      req.body,
      req.user,
    );

    res.json({
      message: "Shift updated successfully",
      shift,
    });
  } catch (err) {
    console.error("UPDATE SHIFT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to update shift",
    });
  }
};

// ===== DELETE =====
exports.deleteShift = async (req, res) => {
  try {
    await attendanceService.deleteShift(req.params.id, req.user);
    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    console.error("DELETE SHIFT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to delete shift",
    });
  }
};
