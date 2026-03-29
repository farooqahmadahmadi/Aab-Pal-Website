const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TasksAssignmentInfo = sequelize.define('TasksAssignmentInfo', {
    task_assignment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    assigned_to: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    task_title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    task_description: {
        type: DataTypes.TEXT
    },
    task_due_date: {
        type: DataTypes.DATEONLY
    },
    task_status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'tasks_assignment_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = TasksAssignmentInfo;