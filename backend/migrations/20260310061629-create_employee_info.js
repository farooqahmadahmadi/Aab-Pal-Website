'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('employee_info', {

      employee_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      emp_full_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      emp_father_name: {
        type: Sequelize.STRING(150),
        allowNull: true
      },

      emp_dob: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      emp_nid_number: {
        type: Sequelize.STRING(15),
        unique: true,
        allowNull: false
      },

      emp_gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other')
      },

      emp_marital_status: {
        type: Sequelize.ENUM('Single', 'Married', 'Other')
      },

      emp_phone: {
        type: Sequelize.STRING(20)
      },

      emp_email: {
        type: Sequelize.STRING(120),
        unique: true
      },

      emp_permanent_address: {
        type: Sequelize.TEXT
      },

      emp_current_address: {
        type: Sequelize.TEXT
      },

      emp_bank_account: {
        type: Sequelize.STRING(50)
      },

      is_deleted: {
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
    await queryInterface.dropTable('employee_info');
  }
};