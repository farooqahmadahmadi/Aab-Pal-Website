'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses_info', {
      expense_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
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
      expense_type: {
        type: Sequelize.ENUM('material', 'labor', 'transport', 'equipment', 'other'),
        allowNull: false
      },
      expense_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      expense_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      expense_description: {
        type: Sequelize.STRING(255)
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
    await queryInterface.dropTable('expenses_info');
  }
};