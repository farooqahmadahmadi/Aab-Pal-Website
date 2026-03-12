'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'system_logs',
      {

        log_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },

        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'user_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },

        action: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        reference_table: {
          type: Sequelize.STRING(255)
        },

        reference_record_id: {
          type: Sequelize.BIGINT.UNSIGNED
        },

        old_value: {
          type: Sequelize.TEXT
        },

        new_value: {
          type: Sequelize.TEXT
        },

        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('system_logs');
  }
};