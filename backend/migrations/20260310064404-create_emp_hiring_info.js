'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emp_hiring_info', {

      hiring_id: {
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

      department_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'department_info',
          key: 'department_id'
        },
        onDelete: 'CASCADE'
      },

      attendance_shift_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'attendance_shifts_info',
          key: 'attendance_shift_id'
        },
        onDelete: 'CASCADE'
      },

      position: {
        type: Sequelize.STRING(50)
      },

      employement_type: {
        type: Sequelize.STRING(50)
      },

      hire_date: {
        type: Sequelize.DATEONLY
      },

      end_date: {
        type: Sequelize.DATEONLY
      },

      current_status: {
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
    await queryInterface.dropTable('emp_hiring_info');
  }
};