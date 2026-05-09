const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BlogImages = sequelize.define(
  "BlogImages",
  {
    blog_image_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    blog_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    image_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    image_title: {
      type: DataTypes.STRING(255),
    },

    image_alt: {
      type: DataTypes.STRING(255),
    },

    is_thumbnail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "blog_images",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = BlogImages;
