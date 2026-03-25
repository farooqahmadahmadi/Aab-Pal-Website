const AttendanceShiftsInfo = require("../models/AttendanceShiftsInfo");

const getAllShifts = async () => {
    return await AttendanceShiftsInfo.findAll({ where: { is_deleted: false } });
};

const getShiftById = async (id) => {
    return await AttendanceShiftsInfo.findOne({ where: { attendance_shift_id: id, is_deleted: false } });
};

const createShift = async (data) => {
    return await AttendanceShiftsInfo.create(data);
};

const updateShift = async (id, data) => {
    return await AttendanceShiftsInfo.update(data, { where: { attendance_shift_id: id, is_deleted: false } });
};

const deleteShift = async (id) => {
    return await AttendanceShiftsInfo.update({ is_deleted: true }, { where: { attendance_shift_id: id } });
};

module.exports = {
    getAllShifts,
    getShiftById,
    createShift,
    updateShift,
    deleteShift
};