'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_phases_info', {
      phase_id: {
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
        onDelete: 'CASCADE'
      },
      phase_name: {
        type: Sequelize.STRING(255)
      },
      phase_start_date: {
        type: Sequelize.DATEONLY
      },
      phase_end_date: {
        type: Sequelize.DATEONLY
      },
      phase_status: {
        type: Sequelize.ENUM('Not Started','InProgress','Completed','OnHold','Failed','Other')
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
    await queryInterface.dropTable('project_phases_info');
  }
};