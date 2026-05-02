const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WebsiteLogs = sequelize.define('WebsiteLogs', {
  log_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true
  },

  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  reference_table: {
    type: DataTypes.STRING(100)
  },

  reference_record_id: {
    type: DataTypes.BIGINT.UNSIGNED
  },

  old_value: {
    type: DataTypes.TEXT
  },

  new_value: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'system_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = WebsiteLogs;