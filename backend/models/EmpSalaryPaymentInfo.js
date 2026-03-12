const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmpSalaryPaymentInfo = sequelize.define(
    "EmpSalaryPaymentInfo",
    {

        payment_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        employee_salary_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        attend_summary_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        salary_bonus: {
            type: DataTypes.DECIMAL(10, 2)
        },

        salary_deducation: {
            type: DataTypes.DECIMAL(10, 2)
        },

        paid_amount: {
            type: DataTypes.DECIMAL(10, 2)
        },

        payment_date: {
            type: DataTypes.DATEONLY
        },

        payment_status: {
            type: DataTypes.STRING(50)
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
    {
        tableName: "emp_salary_payment_info",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = EmpSalaryPaymentInfo;