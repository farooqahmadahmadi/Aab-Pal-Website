const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MaterialsInfo = sequelize.define("MaterialsInfo", {
    material_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    material_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    material_unit: {
        type: DataTypes.ENUM('Meter', 'Squire Meter', 'Kg', 'Tone'),
    },
    current_stock: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    unit_price: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "materials_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = MaterialsInfo;