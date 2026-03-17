const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmpAttendanceInfo = sequelize.define("EmpAttendanceInfo", {
    emp_attendance_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    attendance_date: {
        type: DataTypes.DATEONLY
    },
    attendance_status: {
        type: DataTypes.ENUM('Present', 'Absent', 'Leave', 'Sick')
    },
    check_in_time: {
        type: DataTypes.TIME
    },
    check_out_time: {
        type: DataTypes.TIME
    },
    total_work_hours: {
        type: DataTypes.DECIMAL(5, 2)
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "emp_attendance_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EmpAttendanceInfo;