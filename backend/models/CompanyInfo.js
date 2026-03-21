const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompanyInfo = sequelize.define('CompanyInfo', {
  company_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  license_expire_date: {
    type: DataTypes.DATE
  },
  company_phone: {
    type: DataTypes.STRING(20)
  },
  company_email: {
    type: DataTypes.STRING(120),
    unique: true
  },
  company_address: {
    type: DataTypes.STRING(255)
  },
  company_logo_url: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'company_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = CompanyInfo;