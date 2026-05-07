"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contact_us_page", {
      contact_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      contact_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      contact_email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      contact_phone: {
        type: Sequelize.STRING(50),
      },

      contact_title: {
        type: Sequelize.STRING(200),
      },

      contact_message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      is_replied: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      replied_at: {
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
    await queryInterface.dropTable("contact_us_page");
  },
};