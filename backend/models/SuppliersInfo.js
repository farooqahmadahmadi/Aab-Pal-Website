const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SuppliersInfo = sequelize.define("SuppliersInfo", {
    supplier_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    supplier_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    supplier_phone: {
        type: DataTypes.STRING(20)
    },
    supplier_email: {
        type: DataTypes.STRING(120)
    },
    supplier_address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    supplier_status: {
        type: DataTypes.ENUM('Active','InActive'),
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "suppliers_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = SuppliersInfo