const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmpAttendSummaryInfo = sequelize.define("EmpAttendSummaryInfo", {
    attend_summary_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    year_and_month: {
        type: DataTypes.STRING(20)
    },
    total_present: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    total_absent: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    total_leave: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    total_sick: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "emp_attend_summary_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EmpAttendSummaryInfo;