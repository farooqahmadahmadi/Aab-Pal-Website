'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'notifications',
      {

        notification_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },

        notification_recipients: {
          type: Sequelize.ENUM(
            'Admin', 'Admins',
            'HR', 'HRs',
            'Financial', 'Financials',
            'Project Manager', 'Project Managers',
            'Employee', 'Employees',
            'Client', 'Clients'
          ),
          allowNull: false
        },

        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'user_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        notification_title: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        notification_message: {
          type: Sequelize.TEXT,
          allowNull: false
        },

        is_read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },

        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }

      });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  }
};