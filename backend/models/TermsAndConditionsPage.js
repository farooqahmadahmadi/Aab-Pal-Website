const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");

const TermsAndConditionsPage = sequelize.define(
  "TermsAndConditionsPage",
  {
    tc_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    tc_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    tc_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "terms_and_conditions_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = TermsAndConditionsPage;
