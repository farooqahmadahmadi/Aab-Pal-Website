"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("website_notifications", {
      notification_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      recipient_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      recipient_type: {
        type: Sequelize.STRING(50), // e.g: user, employee, client
        allowNull: false,
      },

      notification_title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      notification_message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("website_notifications");
  },
};
