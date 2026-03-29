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
        references: {
          model: 'project_info',
          key: 'project_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      contract_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      contract_number: {
        type: Sequelize.STRING(10)
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
        type: Sequelize.ENUM('Draft', 'Active', 'Completed', 'Cancelled')
      },
      contract_file_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('contract_info');
  }
};