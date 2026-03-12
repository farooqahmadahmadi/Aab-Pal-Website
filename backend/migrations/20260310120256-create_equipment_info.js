'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('equipment_info', {

      equipment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      equip_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      equip_company: {
        type: Sequelize.STRING(150)
      },

      equip_serial_number: {
        type: Sequelize.STRING(150)
      },

      equip_purchase_date: {
        type: Sequelize.DATEONLY
      },

      equip_purchase_price: {
        type: Sequelize.DECIMAL(12, 2)
      },

      equip_current_status: {
        type: Sequelize.STRING(50),
        allowNull: false
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
    await queryInterface.dropTable('equipment_info');
  }
};