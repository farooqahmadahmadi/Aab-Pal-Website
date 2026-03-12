'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('equipment_maintenance_info', {
      
      equip_maintenance_id: {
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

      maintenance_description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      maintenance_cost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      maintenance_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
    await queryInterface.dropTable('equipment_maintenance_info');
  }
};