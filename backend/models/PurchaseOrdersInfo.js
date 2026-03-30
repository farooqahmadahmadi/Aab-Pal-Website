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
        allowNull: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    po_type: {
        type: DataTypes.ENUM('In', 'Out')
    },
    po_status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Ordered', 'Received', 'Sent', 'Cancelled')
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