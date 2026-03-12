const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EquipmentInfo = sequelize.define(
    "EquipmentInfo",
    {

        equipment_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        equip_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        equip_company: {
            type: DataTypes.STRING(150)
        },

        equip_serial_number: {
            type: DataTypes.STRING(150)
        },

        equip_purchase_date: {
            type: DataTypes.DATEONLY
        },

        equip_purchase_price: {
            type: DataTypes.DECIMAL(12, 2)
        },

        equip_current_status: {
            type: DataTypes.STRING(50),
            allowNull: false
        }

    },
    {
        tableName: "equipment_info",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = EquipmentInfo;