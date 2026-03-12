const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StockTransactionInfo = sequelize.define(
    'StockTransactionsInfo',
    {

        stock_transaction_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        material_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        project_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        quantity: {
            type: DataTypes.INTEGER
        },

        stock_transaction_type: {
            type: DataTypes.ENUM(
                'IN',
                'OUT',
                'ADJUSTMENT'
            )
        },

        stock_transaction_date: {
            type: DataTypes.DATEONLY
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {

    tableName: 'stock_transactions_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = StockTransactionInfo;