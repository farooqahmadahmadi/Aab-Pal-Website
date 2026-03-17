'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('safety_incidents_info', {
      incident_id: {
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
      incident_description: {
        type: Sequelize.TEXT
      },
      incident_date: {
        type: Sequelize.DATEONLY
      },
      incident_severity: {
        type: Sequelize.ENUM('Low', 'Medium', 'High', 'Critical')
      },
      action_taken: {
        type: Sequelize.TEXT
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
  async down(queryInterface) {
    await queryInterface.dropTable('safety_incidents_info');
  }
};