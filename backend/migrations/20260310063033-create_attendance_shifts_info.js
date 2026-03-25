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
        type: Sequelize.STRING(100)
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
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      reduce: {
        type: Sequelize.BIGINT.UNSIGNED,
        defaultValue: 10
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
    await queryInterface.dropTable('attendance_shifts_info');
  }
};