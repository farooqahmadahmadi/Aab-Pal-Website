"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      user_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      user_email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      failed_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      user_role: {
        type: Sequelize.STRING(50), // (admin, hr, client, etc.)
        allowNull: false,
        defaultValue: "client",
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      user_photo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};
