'use strict';

const sequelize = require("../config/db");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emp_attendance_info', {
      emp_attendance_id: {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attendance_date: {
        type: Sequelize.DATEONLY
      },
      attendance_status: {
        type: Sequelize.ENUM('Present', 'Absent', 'Leave', 'Sick')
      },
      check_in_time: {
        type: Sequelize.TIME
      },
      check_out_time: {
        type: Sequelize.TIME
      },
      total_work_hours: {
        type: Sequelize.DECIMAL(5, 2)
      },
      attendance_type: {
        type: Sequelize.ENUM('Manual', 'Mobile', 'Biometric', 'Other'),
        defaultValue: 'Mobile'
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('emp_attendance_info');
  }
};