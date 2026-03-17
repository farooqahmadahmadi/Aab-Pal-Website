const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EquipmentMaintenanceInfo = sequelize.define("EquipmentMaintenanceInfo", {
    equip_maintenance_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    equipment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    maintenance_description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    maintenance_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    maintenance_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "equipment_maintenance_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EquipmentMaintenanceInfo;