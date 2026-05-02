const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Users = sequelize.define(
  "Users",
  {
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    user_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    user_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    failed_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    user_role: {
      type: DataTypes.STRING(50),
      defaultValue: "client",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    user_photo: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Users;
