"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employee_educational_info", {
      eei_id: {
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
        onDelete: "CASCADE",
      },
      educational_degree: {
        type: Sequelize.STRING(150),
      },
      educational_institution: {
        type: Sequelize.STRING(200),
      },
      educational_field: {
        type: Sequelize.STRING(150),
      },
      graduation_date: {
        type: Sequelize.DATEONLY,
      },
      description: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable("employee_educational_info");
  },
};
