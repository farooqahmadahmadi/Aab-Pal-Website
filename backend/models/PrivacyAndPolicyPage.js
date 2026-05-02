const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");

const PrivacyAndPolicyPage = sequelize.define(
  "PrivacyAndPolicyPage",
  {
    pp_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    pp_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    pp_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "privacy_and_policy_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = PrivacyAndPolicyPage;
