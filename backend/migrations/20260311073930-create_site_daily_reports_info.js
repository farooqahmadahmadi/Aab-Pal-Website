'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_daily_reports_info', {
      report_id: {
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
      prepared_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employee_info',
          key: 'employee_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      report_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      weather: {
        type: Sequelize.STRING(100)
      },
      report_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      work_completed: {
        type: Sequelize.TEXT
      },
      issues: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('site_daily_reports_info');
  }
};