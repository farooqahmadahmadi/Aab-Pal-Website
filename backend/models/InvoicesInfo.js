const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InvoicesInfo = sequelize.define('InvoicesInfo', {
    invoice_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    client_id: {
        type: DataTypes.BIGINT.UNSIGNED,
    },
    invoice_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
    },
    paid_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    invoice_due_date: {
        type: DataTypes.DATEONLY
    },
    invoice_description: {
        type: DataTypes.TEXT
    },
    invoice_status: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Partial', 'Overdue', 'Cancelled'),
        defaultValue: 'Pending'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'invoices_info',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = InvoicesInfo;