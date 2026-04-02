'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_settings', {
      setting_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      setting_key: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      setting_value: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      setting_group: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('system_settings');
  }
};