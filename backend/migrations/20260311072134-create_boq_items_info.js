'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('boq_items_info', {

      boq_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'project_info',
          key: 'project_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      item_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      unit: {
        type: Sequelize.STRING(50)
      },

      item_quantity: {
        type: Sequelize.DECIMAL(14,2),
        defaultValue: 0,
        allowNull: false
      },

      unit_price: {
        type: Sequelize.DECIMAL(14,2)
      },

      total_amount: {
        type: Sequelize.DECIMAL(14,2)
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('boq_items_info');
  }
};