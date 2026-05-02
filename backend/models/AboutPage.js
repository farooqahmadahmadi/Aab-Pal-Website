const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const WebsiteLanguage = require('./WebsiteLanguage');

const AboutPage = sequelize.define('AboutPage', {
  about_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  language_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },

  about_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  about_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  about_image_url: {
    type: DataTypes.STRING(255)
  },

  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'about_page',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AboutPage;