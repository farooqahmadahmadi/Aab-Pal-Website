const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SystemLogs = sequelize.define('SystemLogs', {
    log_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    reference_table: {
        type: DataTypes.STRING(255)
    },
    reference_record_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },
    old_value: {
        type: DataTypes.TEXT
    },
    new_value: {
        type: DataTypes.TEXT
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'system_logs',
    timestamps: true,
    createdAt: 'created_at'
});

module.exports = SystemLogs;