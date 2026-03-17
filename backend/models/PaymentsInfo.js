const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payments = sequelize.define('payments_info', {
    payment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },
    payment_amount: {
        type: DataTypes.DECIMAL(12, 2)
    },
    payment_date: {
        type: DataTypes.DATEONLY
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'bank', 'transfer', 'cheque')
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
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

