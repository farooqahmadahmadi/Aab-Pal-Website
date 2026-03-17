const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmployeeInfo = sequelize.define("EmployeeInfo", {
    employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    emp_full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    emp_father_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    emp_dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    emp_nid_number: {
        type: DataTypes.STRING(15),
        unique: true,
        allowNull: false,
    },
    emp_gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true,
    },
    emp_marital_status: {
        type: DataTypes.ENUM("Single", "Married", "Other"),
        allowNull: true,
    },
    emp_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    emp_email: {
        type: DataTypes.STRING(120),
        unique: true,
        allowNull: true,
    },
    emp_permanent_address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    emp_current_address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    emp_bank_account: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "employee_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = EmployeeInfo;