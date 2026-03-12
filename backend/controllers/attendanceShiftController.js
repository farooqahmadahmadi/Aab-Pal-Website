const AttendanceShiftsInfo = require("../models/AttendanceShiftsInfo");

// GET all shifts
exports.getAllShifts = async (req, res) => {
    try {
        const shifts = await AttendanceShiftsInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shifts", error });
    }
};

// GET shift by ID
exports.getShiftById = async (req, res) => {
    try {
        const shift = await AttendanceShiftsInfo.findByPk(req.params.id);
        if (!shift || shift.is_deleted) {
            return res.status(404).json({ message: "Shift not found" });
        }
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shift", error });
    }
};

// CREATE shift
exports.createShift = async (req, res) => {
    try {
        const shift = await AttendanceShiftsInfo.create(req.body);
        res.status(201).json(shift);
    } catch (error) {
        res.status(500).json({ message: "Error creating shift", error });
    }
};

// UPDATE shift
exports.updateShift = async (req, res) => {
    try {
        const shift = await AttendanceShiftsInfo.findByPk(req.params.id);
        if (!shift || shift.is_deleted) {
            return res.status(404).json({ message: "Shift not found" });
        }
        await shift.update(req.body);
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ message: "Error updating shift", error });
    }
};

// DELETE shift (soft delete)
exports.deleteShift = async (req, res) => {
    try {
        const shift = await AttendanceShiftsInfo.findByPk(req.params.id);
        if (!shift) {
            return res.status(404).json({ message: "Shift not found" });
        }
        await shift.update({ is_deleted: true });
        res.status(200).json({ message: "Shift deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shift", error });
    }
};
