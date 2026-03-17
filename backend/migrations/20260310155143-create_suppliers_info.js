'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers_info', {
      supplier_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      supplier_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      supplier_phone: {
        type: Sequelize.STRING(20)
      },
      supplier_email: {
        type: Sequelize.STRING(120)
      },
      supplier_address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('suppliers_info');
  }
};