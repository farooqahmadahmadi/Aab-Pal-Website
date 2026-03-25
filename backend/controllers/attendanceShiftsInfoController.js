const attendanceService = require("../services/attendanceShiftsInfoService");

const getShifts = async (req, res) => {
    try {
        const shifts = await attendanceService.getAllShifts();
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch shifts", error: err.message });
    }
};

const getShift = async (req, res) => {
    try {
        const shift = await attendanceService.getShiftById(req.params.id);
        if (!shift) return res.status(404).json({ message: "Shift not found" });
        res.json(shift);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch shift", error: err.message });
    }
};

const createShift = async (req, res) => {
    try {
        const shift = await attendanceService.createShift(req.body);
        res.status(201).json(shift);
    } catch (err) {
        res.status(400).json({ message: "Failed to create shift", error: err.message });
    }
};

const updateShift = async (req, res) => {
    try {
        await attendanceService.updateShift(req.params.id, req.body);
        res.json({ message: "Shift updated successfully" });
    } catch (err) {
        res.status(400).json({ message: "Failed to update shift", error: err.message });
    }
};

const deleteShift = async (req, res) => {
    try {
        await attendanceService.deleteShift(req.params.id);
        res.json({ message: "Shift deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Failed to delete shift", error: err.message });
    }
};

module.exports = {
    getShifts,
    getShift,
    createShift,
    updateShift,
    deleteShift
};
