const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentsInfo = sequelize.define('payments_info', {
    payment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },
    payment_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATEONLY
    },
    payment_method: {
        type: DataTypes.ENUM('Cash', 'Bank', 'Transfer', 'Cheque', 'Other')
    },
    payment_status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
        defaultValue: 'Pending'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'payments_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = PaymentsInfo;