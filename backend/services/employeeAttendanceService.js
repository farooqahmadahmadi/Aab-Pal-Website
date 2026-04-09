const EmpAttendance = require("../models/EmpAttendanceInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

const EmployeeAttendanceService = {
  // ===== GET ALL =====
  getAll: async () => {
    return await EmpAttendance.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },

  // ===== GET BY ID =====
  getById: async (id) => {
    return await EmpAttendance.findOne({
      where: { emp_attendance_id: id, is_deleted: false },
    });
  },

  // ===== CREATE =====
  create: async (data, user = {}) => {
    const record = await EmpAttendance.create(data);

    await logService.createLog({
      user_id: user.user_id || 0,
      action: "CREATE",
      reference_table: "emp_attendance",
      reference_record_id: record.emp_attendance_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== UPDATE =====
  update: async (id, data, user = {}) => {
    const record = await EmpAttendance.findOne({
      where: { emp_attendance_id: id, is_deleted: false },
    });
    if (!record) throw new Error("Attendance record not found");

    const oldValue = record.toJSON();
    await record.update(data);

    await logService.createLog({
      user_id: user.user_id || 0,
      action: "UPDATE",
      reference_table: "emp_attendance",
      reference_record_id: record.emp_attendance_id,
      old_value: oldValue,
      new_value: record.toJSON(),
    });

    return record;
  },

  // ===== DELETE (Soft) =====
  delete: async (id, user = {}) => {
    const record = await EmpAttendance.findOne({
      where: { emp_attendance_id: id, is_deleted: false },
    });
    if (!record) throw new Error("Attendance record not found");

    await handleDelete(record, user, "emp_attendance", user.user_id || 0);

    return true;
  },

  // ===== GET TODAY FOR USER =====
  getTodayByUser: async (employee_id) => {
    const today = new Date().toISOString().slice(0, 10);
    return await EmpAttendance.findOne({
      where: { employee_id, attendance_date: today, is_deleted: false },
    });
  },

  // ===== GET ALL FOR USER =====
  getAllByUser: async (employee_id) => {
    return await EmpAttendance.findAll({
      where: { employee_id, is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },
};

module.exports = EmployeeAttendanceService;