const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BlogComments = sequelize.define(
  "BlogComments",
  {
    comment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    blog_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    visitor_ip: {
      type: DataTypes.STRING(45),
    },

    visitor_photo: {
      type: DataTypes.STRING(255),
    },

    visitor_email: {
      type: DataTypes.STRING(150),
    },

    visitor_rating: {
      type: DataTypes.INTEGER,
    },

    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    approved_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "blog_comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = BlogComments;
