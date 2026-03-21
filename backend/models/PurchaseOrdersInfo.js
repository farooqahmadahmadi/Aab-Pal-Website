const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PurchaseOrdersInfo = sequelize.define('PurchaseOrdersInfo', {
    po_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    supplier_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2)
    },
    po_status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Ordered', 'Received', 'Cancelled')
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'purchase_orders_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = PurchaseOrdersInfo;