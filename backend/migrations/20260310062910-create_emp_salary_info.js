'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('emp_salary_info', {

      employee_salary_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      employee_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employee_info',
          key: 'employee_id'
        },
        onDelete: 'CASCADE'
      },

      base_salary: {
        type: Sequelize.DECIMAL(10, 2)
      },

      allowance: {
        type: Sequelize.DECIMAL(10, 2)
      },

      effective_from: {
        type: Sequelize.DATEONLY
      },

      effective_to: {
        type: Sequelize.DATEONLY
      },

      created_at: {
        type: Sequelize.DATE
      },

      updated_at: {
        type: Sequelize.DATE
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }

    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('emp_salary_info');
  }
};