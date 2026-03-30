'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_order_items_info', {
      po_item_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      po_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'purchase_orders_info',
          key: 'po_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      material_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'materials_info',
          key: 'material_id'
        }
      },
      po_item_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      po_item_unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
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
    await queryInterface.dropTable('purchase_order_items_info');
  }
};