const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WebsiteNotifications = sequelize.define(
  "WebsiteNotifications",
  {
    notification_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    recipient_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    recipient_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    notification_title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    notification_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = WebsiteNotifications;
