const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const WebsitePages = require('./WebsitePages');

const WebPageViews = sequelize.define('WebPageViews', {
  view_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  web_page_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },

  visitor_ip: {
    type: DataTypes.STRING(100)
  },

  visitor_agent: {
    type: DataTypes.TEXT
  },

  viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'web_page_views',
  timestamps: false
});

module.exports = WebPageViews;