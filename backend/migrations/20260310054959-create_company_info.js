'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_info', {
      company_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      company_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      license_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      license_expire_date: {
        type: Sequelize.DATE,
      },
      company_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      company_email: {
        type: Sequelize.STRING(120),
        allowNull: true,
        unique: true
      },
      company_address: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      company_logo_url: {
        type: Sequelize.STRING(255),
        allowNull: true
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
    await queryInterface.dropTable('company_info');
  }
};