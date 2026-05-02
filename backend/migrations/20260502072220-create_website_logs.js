"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("website_logs", {
      log_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      reference_table: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      reference_record_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      old_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      new_value: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("website_logs");
  },
};
