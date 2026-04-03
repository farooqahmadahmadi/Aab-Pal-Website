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
        allowNull: true,
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
      invoice_type: {
        type: Sequelize.ENUM("In", "Out"),
      },
      invoice_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      paid_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      invoice_due_date: {
        type: Sequelize.DATEONLY
      },
      invoice_description: {
        type: Sequelize.TEXT
      },
      invoice_status: {
        type: Sequelize.ENUM('Pending', 'Paid', 'Partial', 'Overdue', 'Cancelled'),
        defaultValue: 'Pending'
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('invoices_info');
  }
};