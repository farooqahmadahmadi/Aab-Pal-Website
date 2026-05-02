const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");

const OurProjectsPage = sequelize.define(
  "OurProjectsPage",
  {
    project_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    project_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    project_address: {
      type: DataTypes.STRING(255),
    },

    project_image: {
      type: DataTypes.STRING(255),
    },

    project_status: {
      type: DataTypes.STRING(100),
      defaultValue: "ongoing",
    },
  },
  {
    tableName: "our_projects_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = OurProjectsPage;
