const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SiteDailyReportsInfo = sequelize.define('SiteDailyReportsInfo', {

    report_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },

    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    prepared_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    report_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    weather: {
        type: DataTypes.STRING(100)
    },

    work_completed: {
        type: DataTypes.TEXT
    },

    issues: {
        type: DataTypes.TEXT
    },

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {

    tableName: 'site_daily_reports_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = SiteDailyReportsInfo;