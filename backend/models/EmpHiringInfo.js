const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmpHiringInfo = sequelize.define("EmpHiringInfo", {
    hiring_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    department_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    attendance_shift_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(50)
    },
    employment_type: {
        type: DataTypes.STRING(50)
    },
    hire_date: {
        type: DataTypes.DATEONLY
    },
    end_date: {
        type: DataTypes.DATEONLY
    },
    current_status: {
        type: DataTypes.ENUM('Active', 'InActive','Other')
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "emp_hiring_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EmpHiringInfo;