"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("testimonials_page", {
      testimonial_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      testimonial_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      testimonial_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      testimonial_photo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      testimonial_message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      testimonial_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 5,
      },

      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("testimonials_page");
  },
};
