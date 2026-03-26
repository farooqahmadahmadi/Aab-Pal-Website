const EmpAttendance = require("../models/EmpAttendanceInfo");
const EmpHiring = require("../models/EmpHiringInfo");
const Shift = require("../models/AttendanceShiftsInfo");

// ===== Distance (meters) =====
const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = v => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ===== GET ALL =====
exports.getAllAttendance = async (req, res) => {
    try {
        const data = await EmpAttendance.findAll({
            where: { is_deleted: false },
            order: [["created_at", "DESC"]]
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Fetch failed" });
    }
};

// ===== CHECK IN =====
exports.checkIn = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;
        const { latitude, longitude } = req.body;

        if (!employee_id) return res.status(400).json({ message: "Invalid token (employee_id missing)" });

        const today = new Date().toISOString().slice(0, 10);

        const existing = await EmpAttendance.findOne({
            where: { employee_id, attendance_date: today }
        });
        if (existing) return res.status(400).json({ message: "Already checked in" });

        const hiring = await EmpHiring.findOne({
            where: { employee_id, is_deleted: false }
        });
        if (!hiring) return res.status(404).json({ message: "No hiring info" });

        const shift = await Shift.findByPk(hiring.attendance_shift_id);
        if (!shift) return res.status(404).json({ message: "Shift not found" });

        // ===== Shift Timing Check =====
        const now = new Date();
        const nowTimeStr = now.toTimeString().slice(0, 8); // HH:MM:SS
        if (shift.check_in_start && shift.check_in_end) {
            if (nowTimeStr < shift.check_in_start || nowTimeStr > shift.check_in_end) {
                return res.status(400).json({
                    message: `Check-in allowed only between ${shift.check_in_start} - ${shift.check_in_end}`
                });
            }
        }

        // ===== LOCATION CHECK =====
        if (shift.reduce && shift.reduce > 0) {
            if (!latitude || !longitude) return res.status(400).json({ message: "Location required" });

            const distance = getDistanceMeters(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(shift.latitude),
                parseFloat(shift.longitude)
            );

            if (distance > shift.reduce) {
                return res.status(400).json({ message: `Out of allowed area (${Math.round(distance)}m)` });
            }
        }

        const nowTime = new Date().toTimeString().slice(0, 8);

        const record = await EmpAttendance.create({
            employee_id,
            attendance_date: today,
            check_in_time: nowTime,
            attendance_status: "Present"
        });

        res.json({ message: "Checked in successfully", data: record });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Check-in failed" });
    }
};

// ===== CHECK OUT =====
exports.checkOut = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;
        const { latitude, longitude } = req.body;

        if (!employee_id) return res.status(400).json({ message: "Invalid token" });

        const today = new Date().toISOString().slice(0, 10);

        const record = await EmpAttendance.findOne({
            where: { employee_id, attendance_date: today }
        });
        if (!record) return res.status(400).json({ message: "No check-in found" });
        if (record.check_out_time) return res.status(400).json({ message: "Already checked out" });

        const hiring = await EmpHiring.findOne({
            where: { employee_id, is_deleted: false }
        });
        const shift = await Shift.findByPk(hiring.attendance_shift_id);

        // ===== Shift Timing Check =====
        const now = new Date();
        const nowTimeStr = now.toTimeString().slice(0, 8);
        if (shift.check_out_start && shift.check_out_end) {
            if (nowTimeStr < shift.check_out_start || nowTimeStr > shift.check_out_end) {
                return res.status(400).json({
                    message: `Check-out allowed only between ${shift.check_out_start} - ${shift.check_out_end}`
                });
            }
        }

        // ===== LOCATION CHECK =====
        if (shift.reduce && shift.reduce > 0) {
            if (!latitude || !longitude) return res.status(400).json({ message: "Location required" });

            const distance = getDistanceMeters(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(shift.latitude),
                parseFloat(shift.longitude)
            );

            if (distance > shift.reduce) {
                return res.status(400).json({ message: `Out of allowed area (${Math.round(distance)}m)` });
            }
        }

        const nowTime = new Date().toTimeString().slice(0, 8);

        const checkIn = new Date(`1970-01-01T${record.check_in_time}`);
        const checkOut = new Date(`1970-01-01T${nowTime}`);
        const diff = (checkOut - checkIn) / (1000 * 60 * 60);

        await record.update({
            check_out_time: nowTime,
            total_work_hours: diff.toFixed(2)
        });

        res.json({ message: "Checked out successfully", data: record });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Check-out failed" });
    }
};

// ===== MANUAL CREATE =====
exports.createManual = async (req, res) => {
    try {
        const data = req.body;
        if (!data.employee_id || !data.attendance_date)
            return res.status(400).json({ message: "Employee & date required" });

        const record = await EmpAttendance.create(data);
        res.json({ message: "Manual attendance created", data: record });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Create failed" });
    }
};

// ===== UPDATE =====
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        await EmpAttendance.update(req.body, { where: { emp_attendance_id: id } });
        res.json({ message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
};

// ===== DELETE =====
exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        await EmpAttendance.update({ is_deleted: true }, { where: { emp_attendance_id: id } });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Delete failed" });
    }
};


// ===== GET MY ATTENDANCE (USER ONLY) =====
exports.getMyAttendance = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;

        const data = await EmpAttendance.findAll({
            where: {
                is_deleted: false,
                employee_id: employee_id
            },
            order: [["created_at", "DESC"]]
        });

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Fetch failed" });
    }
};

// ===== GET TODAY FOR LOGGED-IN USER =====
exports.getTodayAttendance = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;
        const today = new Date().toISOString().slice(0, 10);

        const record = await EmpAttendance.findOne({
            where: { employee_id, attendance_date: today }
        });

        res.json(record || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Fetch failed" });
    }
};
