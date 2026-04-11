'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_info', {
      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      client_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      client_nid_number: {
        type: Sequelize.STRING(15),
        unique: true,
        allowNull: false
      },
      client_phone: {
        type: Sequelize.STRING(20)
      },
      client_email: {
        type: Sequelize.STRING(100)
      },
      client_address: {
        type: Sequelize.STRING(255)
      },
      client_photo_url: {
        type: Sequelize.STRING(255)
      },
       is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('client_info');
  }
};