'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks_assignment_info', {

      task_assignment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
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

      assigned_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employee_info',
          key: 'employee_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      task_description: {
        type: Sequelize.TEXT
      },

      task_due_date: {
        type: Sequelize.DATEONLY
      },

      task_status: {
        type: Sequelize.ENUM(
          'Pending',
          'In Progress',
          'Completed',
          'Cancelled'
        ),
        defaultValue: 'Pending'
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks_assignment_info');
  }
};