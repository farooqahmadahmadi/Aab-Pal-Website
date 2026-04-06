const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CashTransactions = sequelize.define('CashTransactionsInfo', {
    transaction_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    reference_type: {
        type: DataTypes.ENUM('Expense', 'InvoicePayment','SalaryPayment', 'Manual')
    },
    reference_id: {
        type: DataTypes.INTEGER
    },
    transaction_type: {
        type: DataTypes.ENUM('Income', 'Expense')
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    transaction_description: {
        type: DataTypes.STRING(255)
    },
    transaction_date: {
        type: DataTypes.DATEONLY
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'cash_transactions_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = CashTransactions;