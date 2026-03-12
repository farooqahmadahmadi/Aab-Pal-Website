'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('contract_info', {

      contract_id: {
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
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      contract_number: {
        type: Sequelize.STRING
      },

      signed_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      contract_start_date: {
        type: Sequelize.DATEONLY
      },

      contract_end_date: {
        type: Sequelize.DATEONLY
      },

      total_value: {
        type: Sequelize.DECIMAL(14, 2)
      },

      contract_status: {
        type: Sequelize.ENUM(
          'Draft',
          'Active',
          'Completed',
          'Cancelled'
        )
      },

      contract_file_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }

    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contract_info');
  }
};