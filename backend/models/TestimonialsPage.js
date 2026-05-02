const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TestimonialsPage = sequelize.define(
  "TestimonialsPage",
  {
    testimonial_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    testimonial_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    testimonial_email: {
      type: DataTypes.STRING(255),
    },

    testimonial_photo: {
      type: DataTypes.STRING(255),
    },

    testimonial_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    testimonial_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
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
    tableName: "testimonials_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = TestimonialsPage;
