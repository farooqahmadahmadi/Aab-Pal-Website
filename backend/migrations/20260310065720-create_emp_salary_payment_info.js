'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emp_salary_payment_info', {
      payment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      employee_salary_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'emp_salary_info',
          key: 'employee_salary_id'
        },
        onDelete: 'CASCADE'
      },
      attend_summary_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'emp_attend_summary_info',
          key: 'attend_summary_id'
        },
        onDelete: 'CASCADE'
      },
      salary_bonus: {
        type: Sequelize.DECIMAL(10, 2)
      },
      salary_deduction: {
        type: Sequelize.DECIMAL(10, 2)
      },
      paid_amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      payment_date: {
        type: Sequelize.DATEONLY
      },
      payment_status: {
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('emp_salary_payment_info');
  }
};