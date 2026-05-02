const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WebsiteLanguage = sequelize.define('WebsiteLanguage', {
  language_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  language_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },

  language_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },

  language_direction: {
    type: DataTypes.ENUM('LTR', 'RTL'),
    allowNull: false,
    defaultValue: 'LTR'
  }
}, {
  tableName: 'website_languages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = WebsiteLanguage;