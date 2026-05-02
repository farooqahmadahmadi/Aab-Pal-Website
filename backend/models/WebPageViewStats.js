const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsitePages = require("./WebsitePages");

const WebPageViewStats = sequelize.define(
  "WebPageViewStats",
  {
    view_state_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    web_page_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    view_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    total_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    unique_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "web_page_view_stats",
    timestamps: false,
  },
);

module.exports = WebPageViewStats;
