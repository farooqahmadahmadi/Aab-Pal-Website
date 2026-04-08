const AttendanceShiftsInfo = require("../models/AttendanceShiftsInfo");
const { handleDelete } = require("../utils/deleteHelper");
const logService = require("./systemLogsService");

// ===== GET ALL =====
exports.getAllShifts = async () => {
  return await AttendanceShiftsInfo.findAll({
    where: { is_deleted: false },
    order: [["attendance_shift_id", "ASC"]],
  });
};

// ===== GET BY ID =====
exports.getShiftById = async (id) => {
  return await AttendanceShiftsInfo.findOne({
    where: { attendance_shift_id: id, is_deleted: false },
  });
};

// ===== CREATE =====
exports.createShift = async (data, user = {}) => {
  const record = await AttendanceShiftsInfo.create(data);

  await logService.createLog({
    user_id: user.user_id || 0,
    action: "CREATE",
    reference_table: "attendance_shifts_info",
    reference_record_id: record.attendance_shift_id,
    old_value: null,
    new_value: record.toJSON(),
  });

  return record;
};

// ===== UPDATE =====
exports.updateShift = async (id, data, user = {}) => {
  const record = await AttendanceShiftsInfo.findByPk(id);

  if (!record || record.is_deleted) throw new Error("Shift not found");

  const oldValue = record.toJSON();

  await record.update(data);

  await logService.createLog({
    user_id: user.user_id || 0,
    action: "UPDATE",
    reference_table: "attendance_shifts_info",
    reference_record_id: record.attendance_shift_id,
    old_value: oldValue,
    new_value: record.toJSON(),
  });

  return record;
};

// ===== DELETE (SOFT + HARD) =====
exports.deleteShift = async (id, user = {}) => {
  const record = await AttendanceShiftsInfo.findByPk(id);

  if (!record || record.is_deleted) throw new Error("Shift not found");

  await handleDelete(record, user, "attendance_shifts_info", user.user_id || 0);

  return true;
};
