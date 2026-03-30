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
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      stock_transaction_type: {
        type: Sequelize.ENUM('IN', 'OUT', 'ADJUSTMENT')
      },
      stock_transaction_date: {
        type: Sequelize.DATEONLY
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('stock_transactions_info');
  }
};