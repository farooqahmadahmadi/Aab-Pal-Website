const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BoqItemsInfo = sequelize.define('BoqItemsInfo', {

    boq_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },

    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    item_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    unit: {
        type: DataTypes.STRING(50)
    },

    item_quantity: {
        type: DataTypes.DECIMAL(14,2),
        defaultValue: 0,
        allowNull: false
    },

    unit_price: {
        type: DataTypes.DECIMAL(14,2)
    },

    total_amount: {
        type: DataTypes.DECIMAL(14,2)
    },

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {

    tableName: 'boq_items_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = BoqItemsInfo;