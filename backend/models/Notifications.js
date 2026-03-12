const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notifications = sequelize.define(
    'Notifications',
    {

        notification_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        notification_recipients: {
            type: DataTypes.ENUM(
                'Admin', 'Admins',
                'HR', 'HRs',
                'Financial', 'Financials',
                'Project Manager', 'Project Managers',
                'Employee', 'Employees',
                'Client', 'Clients'
            ),
            allowNull: false
        },

        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },

        notification_title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        notification_message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        created_at: DataTypes.DATE
    }, {
    tableName: 'notifications',
    timestamps: false
});

module.exports = Notifications;