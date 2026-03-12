const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InvoicesInfo = sequelize.define('InvoicesInfo', {

    invoice_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },

    project_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },

    client_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },

    invoice_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },

    invoice_due_date: {
        type: DataTypes.DATEONLY
    },

    invoice_description: {
        type: DataTypes.TEXT
    },

    invoice_status: {
        type: DataTypes.ENUM(
            'pending',
            'paid',
            'partial',
            'overdue',
            'cancelled'
        ),
        defaultValue: 'pending'
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: false,
    tableName: 'invoices_info'
});

module.exports = InvoicesInfo;