const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmpSalaryInfo = sequelize.define(
    "EmpSalaryInfo",
    {

        employee_salary_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        employee_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        base_salary: {
            type: DataTypes.DECIMAL(10, 2)
        },

        allowance: {
            type: DataTypes.DECIMAL(10, 2)
        },

        effective_from: {
            type: DataTypes.DATEONLY
        },

        effective_to: {
            type: DataTypes.DATEONLY
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
    {
        tableName: "emp_salary_info",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = EmpSalaryInfo;