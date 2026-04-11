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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    user_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    user_role: {
      type: DataTypes.ENUM(
        "Admin",
        "HR",
        "Financial",
        "PM",
        "Employee",
        "Client",
      ),
      allowNull: false,
    },
    login_status: {
      type: DataTypes.ENUM("Online", "Offline"),
      defaultValue: "Offline",
    },
    last_login_at: {
      type: DataTypes.DATE,
    },
    failed_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    access_time_start: {
      type: DataTypes.TIME,
    },
    access_time_end: {
      type: DataTypes.TIME,
    },
    user_photo_url: {
      type: DataTypes.STRING(255),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
