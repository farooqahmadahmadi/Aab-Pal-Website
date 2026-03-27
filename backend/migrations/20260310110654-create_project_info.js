'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_info', {
      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'client_info',
          key: 'client_id'
        },
        onDelete: 'CASCADE'
      },
      project_type: {
        type: Sequelize.ENUM('Residential', 'Commercial', 'Industrial', 'Other')
      },
      project_name: {
        type: Sequelize.STRING(255)
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      project_address: {
        type: Sequelize.STRING(255)
      },
      project_start_date: {
        type: Sequelize.DATEONLY
      },
      project_end_date: {
        type: Sequelize.DATEONLY
      },
      project_estimate_budget: {
        type: Sequelize.DECIMAL(15, 2)
      },
      project_status: {
        type: Sequelize.ENUM('Planed', 'InProgress', 'Completed', 'OnHold', 'Failed', 'Other')
      },
      employee_id: { // Project Manager - Foreign Key to EmployeeInfo
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'employee_info',
          key: 'employee_id'
        },
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('project_info');
  }
};