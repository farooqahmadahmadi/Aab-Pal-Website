'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments_info', {
      payment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'invoices_info',
          key: 'invoice_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      payment_amount: {
        type: Sequelize.DECIMAL(12, 2),
      },
      payment_date: {
        type: Sequelize.DATEONLY
      },
      payment_method: {
        type: Sequelize.ENUM('Cash', 'Bank', 'Transfer', 'Cheque','Other')
      },
      payment_status: {
        type: Sequelize.ENUM('Pending', 'Completed', 'Failed'),
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
    await queryInterface.dropTable('payments_info');
  }
};