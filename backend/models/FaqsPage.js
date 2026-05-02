const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");

const FaqsPage = sequelize.define(
  "FaqsPage",
  {
    faqs_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    faqs_question: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    faqs_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    faqs_category: {
      type: DataTypes.STRING(100),
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "faqs_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = FaqsPage;
