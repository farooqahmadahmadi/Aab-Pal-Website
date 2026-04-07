const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DepartmentInfo = sequelize.define(
  "DepartmentInfo",
  {
    department_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    department_description: {
      type: DataTypes.STRING(255),
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "department_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = DepartmentInfo;
