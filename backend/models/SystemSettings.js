const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SystemSettings = sequelize.define('SystemSettings', {
    setting_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    setting_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    setting_value: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    setting_group: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'system_settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
});

module.exports = SystemSettings;