const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ExpensesInfo = sequelize.define('ExpensesInfo', {
    expense_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    expense_type: {
        type: DataTypes.ENUM('material', 'labor', 'transport', 'equipment', 'other')
    },
    expense_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    expense_date: {
        type: DataTypes.DATEONLY
    },
    expense_description: {
        type: DataTypes.STRING(255)
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'expenses_info',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = ExpensesInfo;