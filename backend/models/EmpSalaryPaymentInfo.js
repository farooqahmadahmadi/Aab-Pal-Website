const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmpSalaryPaymentInfo = sequelize.define("EmpSalaryPaymentInfo", {
    payment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    employee_salary_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    salary_month: {
        type: DataTypes.STRING(7)
    },
    salary_bonus: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    salary_deduction: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    paid_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    payment_date: {
        type: DataTypes.DATEONLY
    },
    payment_status: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Failed','Other'),
        defaultValue: 'Pending'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "emp_salary_payment_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EmpSalaryPaymentInfo;