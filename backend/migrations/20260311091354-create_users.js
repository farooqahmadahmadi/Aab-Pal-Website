'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      user_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },

      user_email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },

      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'client_info',
          key: 'client_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      user_role: {
        type: Sequelize.ENUM(
          'Admin',
          'HR',
          'Financial',
          'Project Manager',
          'Employee',
          'Client'
        ),
        allowNull: false
      },

      login_status: {
        type: Sequelize.ENUM('Online', 'Offline'),
        defaultValue: 'Offline'
      },

      last_login_at: {
        type: Sequelize.DATE
      },

      failed_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      access_time_start: {
        type: Sequelize.TIME
      },

      access_time_end: {
        type: Sequelize.TIME
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      password_reset_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};