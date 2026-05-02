const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");

const ServicesPage = sequelize.define(
  "ServicesPage",
  {
    service_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    service_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    service_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    service_image: {
      type: DataTypes.STRING(255),
    },

    service_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "services_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = ServicesPage;
