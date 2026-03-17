const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContractMilestonesInfo = sequelize.define('ContractMilestonesInfo', {
    milestone_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    contract_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATEONLY
    },
    amount: {
        type: DataTypes.DECIMAL(14, 2)
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Delayed', 'Cancelled')
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'contract_milestones_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ContractMilestonesInfo;