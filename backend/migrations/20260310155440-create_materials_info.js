'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('materials_info', {
      material_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      material_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      material_unit: {
        type: Sequelize.ENUM('Meter', 'Squire Meter', 'Kg', 'Tone'),
      },
      current_stock: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
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
    await queryInterface.dropTable('materials_info');
  }
};