const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompanyDocument = sequelize.define('CompanyDocument', {
    document_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
    },
    doc_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    doc_description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    doc_file_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'company_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = CompanyDocument;