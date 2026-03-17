'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment_usage_info', {
      equipment_usage_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      equipment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'equipment_info',
          key: 'equipment_id'
        },
        onDelete: 'CASCADE'
      },
      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'project_info',
          key: 'project_id'
        },
        onDelete: 'SET NULL'
      },
      usage_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      usage_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      usage_description: {
        type: Sequelize.STRING(255)
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
    await queryInterface.dropTable('equipment_usage_info');
  }
};