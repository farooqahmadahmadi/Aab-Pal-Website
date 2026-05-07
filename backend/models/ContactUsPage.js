const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContactUsPage = sequelize.define(
  "ContactUsPage",
  {
    contact_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    contact_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    contact_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    contact_phone: {
      type: DataTypes.STRING(50),
    },

    contact_title: {
      type: DataTypes.STRING(200),
    },

    contact_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_replied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    replied_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "contact_us_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = ContactUsPage;
