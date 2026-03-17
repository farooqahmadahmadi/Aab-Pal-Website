const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SafetyIncidentsInfo = sequelize.define('SafetyIncidentsInfo', {
    incident_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    incident_description: {
        type: DataTypes.TEXT
    },
    incident_date: {
        type: DataTypes.DATEONLY
    },

    incident_severity: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical')
    },
    action_taken: {
        type: DataTypes.TEXT
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'safety_incidents_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SafetyIncidentsInfo;