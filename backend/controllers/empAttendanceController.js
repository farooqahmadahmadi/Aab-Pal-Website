const EmpAttendanceInfo = require("../models/EmpAttendanceInfo");

// GET all attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await EmpAttendanceInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error });
    }
};

// GET attendance by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const record = await EmpAttendanceInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error });
    }
};

// CREATE attendance
exports.createAttendance = async (req, res) => {
    try {
        const record = await EmpAttendanceInfo.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating attendance", error });
    }
};

// UPDATE attendance
exports.updateAttendance = async (req, res) => {
    try {
        const record = await EmpAttendanceInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating attendance", error });
    }
};

// DELETE attendance (soft delete)
exports.deleteAttendance = async (req, res) => {
    try {
        const record = await EmpAttendanceInfo.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        await record.update({ is_deleted: true });
        res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting attendance", error });
    }
};
