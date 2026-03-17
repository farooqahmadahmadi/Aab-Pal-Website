'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices_info', {
      invoice_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'project_info',
          key: 'project_id'
        }
      },
      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'client_info',
          key: 'client_id'
        }
      },
      invoice_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      invoice_due_date: {
        type: Sequelize.DATEONLY
      },
      invoice_description: {
        type: Sequelize.TEXT
      },
      invoice_status: {
        type: Sequelize.ENUM('pending','paid','partial','overdue','cancelled'),
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('invoices_info');
  }
};