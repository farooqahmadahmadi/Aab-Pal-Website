'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_orders_info', {
      po_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      supplier_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'suppliers_info',
          key: 'supplier_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      order_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      po_status: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Ordered', 'Received', 'Cancelled'),
        defaultValue: 'Pending'
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
  async down(queryInterface) {
    await queryInterface.dropTable('purchase_orders_info');
  }
};