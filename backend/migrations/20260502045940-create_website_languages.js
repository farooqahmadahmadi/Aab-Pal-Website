'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('website_languages', {
      language_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      language_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },

      language_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },

      language_direction: {
        type: Sequelize.ENUM('LTR', 'RTL'),
        allowNull: false,
        defaultValue: 'LTR'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('website_languages');
  }
};