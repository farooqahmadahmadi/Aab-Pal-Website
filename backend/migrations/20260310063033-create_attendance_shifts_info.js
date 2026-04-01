'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_shifts_info', {
      attendance_shift_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      shift_name: {
        type: Sequelize.STRING(50)
      },
      check_in_start: {
        type: Sequelize.TIME
      },
      check_in_end: {
        type: Sequelize.TIME
      },
      check_out_start: {
        type: Sequelize.TIME
      },
      check_out_end: {
        type: Sequelize.TIME
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false,
        defaultValue: 0
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false,
        defaultValue: 0
      },
      reduce: {
        type: Sequelize.BIGINT.UNSIGNED,
        defaultValue: 0
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('attendance_shifts_info');
  }
};