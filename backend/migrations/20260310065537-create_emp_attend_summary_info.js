'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emp_attend_summary_info', {
      attend_summary_id: {
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
      year_and_month: {
        type: Sequelize.STRING(20)
      },
      total_present: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      total_absent: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      total_leave: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      total_sick: {
        type: Sequelize.INTEGER.UNSIGNED
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
    await queryInterface.dropTable('emp_attend_summary_info');
  }
};