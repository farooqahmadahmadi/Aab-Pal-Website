'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('contract_milestones_info', {

      milestone_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      contract_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'contract_info',
          key: 'contract_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      due_date: {
        type: Sequelize.DATEONLY
      },

      amount: {
        type: Sequelize.DECIMAL(14, 2)
      },

      status: {
        type: Sequelize.ENUM(
          'Pending',
          'Completed',
          'Delayed',
          'Cancelled'
        )
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
    await queryInterface.dropTable('contract_milestones_info');
  }
};