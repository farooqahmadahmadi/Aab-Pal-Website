'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('stock_transactions_info', {

      stock_transaction_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      material_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'materials_info',
          key: 'material_id'
        }
      },

      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'project_info',
          key: 'project_id'
        }
      },

      quantity: {
        type: Sequelize.INTEGER
      },

      stock_transaction_type: {
        type: Sequelize.ENUM(
          'IN',
          'OUT',
          'ADJUSTMENT'
        )
      },

      stock_transaction_date: {
        type: Sequelize.DATEONLY
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }

    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stock_transactions_info');
  }
};