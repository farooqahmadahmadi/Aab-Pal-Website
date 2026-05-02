const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BlogsPage = sequelize.define('BlogsPage', {
  blog_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  language_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },

  blog_author_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  blog_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  blog_slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },

  blog_type: {
    type: DataTypes.STRING(50)
  },

  blog_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  blog_image: {
    type: DataTypes.STRING(255)
  },

  blog_views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  blog_likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  blog_shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  published_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'blogs_page',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BlogsPage;