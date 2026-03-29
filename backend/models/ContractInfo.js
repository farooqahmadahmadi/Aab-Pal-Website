const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContractInfo = sequelize.define('ContractInfo', {
    contract_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.BIGINT.UNSIGNED,
    },
    contract_name: {
        type: DataTypes.STRING(255)
    },
    contract_number: {
        type: DataTypes.STRING (10)
    },
    signed_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    contract_start_date: {
        type: DataTypes.DATEONLY
    },
    contract_end_date: {
        type: DataTypes.DATEONLY
    },
    total_value: {
        type: DataTypes.DECIMAL(14, 2)
    },
    contract_status: {
        type: DataTypes.ENUM('Draft', 'Active', 'Completed', 'Cancelled')
    },
    contract_file_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'contract_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

});

module.exports = ContractInfo;