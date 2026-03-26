
const EmpAttendance = require("../models/EmpAttendanceInfo");

exports.getAll = async () => { return await EmpAttendance.findAll({ where: { is_deleted: false }, order: [["created_at", "DESC"]] }); };

exports.create = async (data) => { return await EmpAttendance.create(data); };

exports.update = async (id, data) => { return await EmpAttendance.update(data, { where: { emp_attendance_id: id } }); };

exports.delete = async (id) => { return await EmpAttendance.update({ is_deleted: true }, { where: { emp_attendance_id: id } }); };
