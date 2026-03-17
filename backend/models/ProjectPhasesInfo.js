const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectPhasesInfo = sequelize.define("ProjectPhasesInfo", {
    phase_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    phase_name: {
        type: DataTypes.STRING(255)
    },
    phase_start_date: {
        type: DataTypes.DATEONLY
    },
    phase_end_date: {
        type: DataTypes.DATEONLY
    },
    phase_status: {
        type: DataTypes.STRING(50)
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "project_phases_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = ProjectPhasesInfo;