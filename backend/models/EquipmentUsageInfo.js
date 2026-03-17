const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EquipmentUsageInfo = sequelize.define("EquipmentUsageInfo", {
    equipment_usage_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    equipment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },
    usage_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    usage_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    usage_description: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: "equipment_usage_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EquipmentUsageInfo;