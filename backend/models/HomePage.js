const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HomePage = sequelize.define(
  "HomePage",
  {
    section_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    section_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    section_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    section_description: {
      type: DataTypes.TEXT,
    },

    section_image: {
      type: DataTypes.STRING(255),
    },

    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "home_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = HomePage;
