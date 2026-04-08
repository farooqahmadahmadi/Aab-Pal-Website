"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("emp_salary_info", {
      employee_salary_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "employee_info",
          key: "employee_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      base_salary: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      allowance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      effective_from: {
        type: Sequelize.DATEONLY,
      },
      effective_to: {
        type: Sequelize.DATEONLY,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("emp_salary_info");
  },
};
