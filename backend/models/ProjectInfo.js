const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectInfo = sequelize.define("ProjectInfo", {
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    project_type: {
        type: DataTypes.ENUM('Residential', 'Commercial', 'Industrial', 'Other')
    },
    project_name: {
        type: DataTypes.STRING(255)
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    project_address: {
        type: DataTypes.STRING(255)
    },
    project_start_date: {
        type: DataTypes.DATEONLY
    },
    project_end_date: {
        type: DataTypes.DATEONLY
    },
    project_estimate_budget: {
        type: DataTypes.DECIMAL(15, 2)
    },
    project_status: {
        type: DataTypes.ENUM('Planed', 'InProgress', 'Completed', 'OnHold', 'Failed', 'Other')
    },
    employee_id: { // Project Manager - Foreign Key to EmployeeInfo
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "project_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = ProjectInfo;