const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WebsitePages = sequelize.define(
  "WebsitePages",
  {
    web_page_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    page_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    page_slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    page_meta_title: {
      type: DataTypes.STRING(255),
    },

    page_meta_keyword: {
      type: DataTypes.TEXT,
    },

    page_meta_description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "website_pages",
    timestamps: false,
    updatedAt: "updated_at",
  },
);

module.exports = WebsitePages;
