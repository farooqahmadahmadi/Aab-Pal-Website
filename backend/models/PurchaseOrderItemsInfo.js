const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PurchaseOrderItemsInfo = sequelize.define('PurchaseOrderItemInfo', {
    po_item_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    po_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    material_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    po_item_quantity: {
        type: DataTypes.INTEGER
    },
    po_item_unit_price: {
        type: DataTypes.DECIMAL(12, 2)
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'purchase_order_items_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = PurchaseOrderItemsInfo;